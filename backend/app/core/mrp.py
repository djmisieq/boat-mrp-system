from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import logging

from app.models.material_requirement import MaterialRequirement, MaterialRequirementItem, MaterialRequirementOrder, MaterialRequirementStatus
from app.models.order import Order, OrderStatus
from app.models.product import Product, ProductType
from app.models.bom import BOM, BOMItem


logger = logging.getLogger(__name__)


def calculate_mrp(
    db: Session,
    material_requirement_id: int,
    user_id: Optional[int] = None
) -> MaterialRequirement:
    """
    Główna funkcja obliczająca zapotrzebowanie materiałowe na podstawie ID zapotrzebowania.
    
    Args:
        db: Sesja bazy danych
        material_requirement_id: ID zapotrzebowania materiałowego
        user_id: ID użytkownika wykonującego obliczenia
        
    Returns:
        Zaktualizowane zapotrzebowanie materiałowe
    """
    # Pobranie obiektu zapotrzebowania materiałowego
    material_requirement = db.query(MaterialRequirement).filter(
        MaterialRequirement.id == material_requirement_id
    ).first()
    
    if not material_requirement:
        raise ValueError(f"Nie znaleziono zapotrzebowania materiałowego o ID {material_requirement_id}")
    
    # Pobranie zamówień powiązanych z zapotrzebowaniem
    order_links = db.query(MaterialRequirementOrder).filter(
        MaterialRequirementOrder.material_requirement_id == material_requirement_id
    ).all()
    
    if not order_links:
        raise ValueError(f"Zapotrzebowanie materiałowe {material_requirement_id} nie ma powiązanych zamówień")
    
    order_ids = [link.order_id for link in order_links]
    
    # Pobranie zamówień
    orders = db.query(Order).filter(
        Order.id.in_(order_ids),
        Order.status.in_([OrderStatus.CONFIRMED, OrderStatus.IN_PRODUCTION])
    ).all()
    
    if not orders:
        raise ValueError("Nie znaleziono potwierdzonych zamówień do obliczenia zapotrzebowania")
    
    # Usunięcie istniejących pozycji zapotrzebowania
    db.query(MaterialRequirementItem).filter(
        MaterialRequirementItem.material_requirement_id == material_requirement_id
    ).delete()
    
    # Słownik do przechowywania zbiorczego zapotrzebowania na komponenty
    components_demand = {}
    
    # Przetwarzanie każdego zamówienia
    for order in orders:
        for order_item in order.items:
            product = order_item.product
            quantity = order_item.quantity
            
            # Jeśli to produkt końcowy, oblicz zapotrzebowanie na komponenty
            if product.product_type == ProductType.FINAL:
                # Znajdź aktywną listę BOM dla produktu
                bom = db.query(BOM).filter(
                    BOM.product_id == product.id,
                    BOM.is_active == True
                ).first()
                
                if bom:
                    # Rekurencyjne obliczenie zapotrzebowania dla produktu
                    calculate_component_requirements(
                        db=db,
                        components_demand=components_demand,
                        product_id=product.id,
                        quantity=quantity,
                        required_date=order.required_date or material_requirement.planning_end_date,
                        consider_stock=material_requirement.consider_stock,
                        consider_min_stock=material_requirement.consider_min_stock
                    )
                else:
                    logger.warning(f"Nie znaleziono aktywnej listy BOM dla produktu {product.id}")
            else:
                # Jeśli to komponent lub materiał, dodaj go bezpośrednio
                if product.id not in components_demand:
                    components_demand[product.id] = {
                        "required_quantity": 0,
                        "required_date": order.required_date or material_requirement.planning_end_date
                    }
                
                components_demand[product.id]["required_quantity"] += quantity
    
    # Tworzenie pozycji zapotrzebowania materiałowego na podstawie obliczonych wartości
    for product_id, demand_info in components_demand.items():
        product = db.query(Product).get(product_id)
        if not product:
            continue
        
        required_quantity = demand_info["required_quantity"]
        required_date = demand_info["required_date"]
        
        # Obliczenie dostępnej ilości z uwzględnieniem minimalnych stanów
        available_quantity = 0
        if material_requirement.consider_stock:
            available_quantity = product.quantity_in_stock
            if material_requirement.consider_min_stock and product.minimum_stock > 0:
                available_quantity = max(0, available_quantity - product.minimum_stock)
        
        # Obliczenie ilości do zamówienia
        quantity_to_procure = max(0, required_quantity - available_quantity)
        
        # Jeśli nie ma potrzeby zamawiania, pomijamy
        if quantity_to_procure <= 0 and not material_requirement.consider_min_stock:
            continue
        
        # Obliczenie daty planowanego zamówienia z uwzględnieniem lead time
        planned_order_date = None
        if required_date and product.lead_time_days > 0:
            planned_order_date = required_date - timedelta(days=product.lead_time_days)
        
        # Dodanie pozycji zapotrzebowania
        material_requirement_item = MaterialRequirementItem(
            material_requirement_id=material_requirement_id,
            product_id=product_id,
            required_quantity=required_quantity,
            available_quantity=available_quantity,
            quantity_to_procure=quantity_to_procure,
            requirement_date=required_date,
            planned_order_date=planned_order_date,
            is_available=(quantity_to_procure <= 0),
            notes=f"Lead time: {product.lead_time_days} dni" if product.lead_time_days > 0 else None
        )
        
        db.add(material_requirement_item)
    
    # Aktualizacja zapotrzebowania materiałowego
    material_requirement.status = MaterialRequirementStatus.CALCULATED
    material_requirement.calculation_date = datetime.utcnow()
    if user_id:
        material_requirement.user_id = user_id
    
    db.commit()
    db.refresh(material_requirement)
    
    return material_requirement


def calculate_component_requirements(
    db: Session,
    components_demand: Dict[int, Dict[str, Any]],
    product_id: int,
    quantity: float,
    required_date: Optional[datetime] = None,
    consider_stock: bool = True,
    consider_min_stock: bool = True
) -> None:
    """
    Funkcja rekurencyjnie obliczająca zapotrzebowanie na komponenty dla danego produktu.
    
    Args:
        db: Sesja bazy danych
        components_demand: Słownik do przechowywania zbiorczego zapotrzebowania na komponenty
        product_id: ID produktu
        quantity: Ilość produktu
        required_date: Data zapotrzebowania
        consider_stock: Czy uwzględniać stany magazynowe
        consider_min_stock: Czy uwzględniać minimalne stany magazynowe
    """
    # Znajdź aktywną listę BOM dla produktu
    bom = db.query(BOM).filter(
        BOM.product_id == product_id,
        BOM.is_active == True
    ).first()
    
    if not bom:
        logger.warning(f"Nie znaleziono aktywnej listy BOM dla produktu {product_id}")
        return
    
    # Przetwarzanie każdego komponentu z listy BOM
    for bom_item in bom.items:
        component = bom_item.component
        component_quantity = bom_item.quantity * quantity
        
        # Jeśli komponent jest opcjonalny, pomijamy go
        if bom_item.is_optional:
            continue
        
        # Jeśli komponent jest złożony (ma własną listę BOM), rekurencyjnie oblicz zapotrzebowanie
        if component.product_type in [ProductType.FINAL, ProductType.COMPONENT]:
            sub_bom = db.query(BOM).filter(
                BOM.product_id == component.id,
                BOM.is_active == True
            ).first()
            
            if sub_bom:
                calculate_component_requirements(
                    db=db,
                    components_demand=components_demand,
                    product_id=component.id,
                    quantity=component_quantity,
                    required_date=required_date,
                    consider_stock=consider_stock,
                    consider_min_stock=consider_min_stock
                )
            else:
                # Jeśli komponent nie ma listy BOM, dodaj go do zapotrzebowania
                if component.id not in components_demand:
                    components_demand[component.id] = {
                        "required_quantity": 0,
                        "required_date": required_date
                    }
                
                components_demand[component.id]["required_quantity"] += component_quantity
                # Aktualizacja daty, jeśli bieżąca jest wcześniejsza
                if required_date and (not components_demand[component.id]["required_date"] or 
                                    required_date < components_demand[component.id]["required_date"]):
                    components_demand[component.id]["required_date"] = required_date
        else:
            # Komponent jest materiałem lub usługą, dodaj go do zapotrzebowania
            if component.id not in components_demand:
                components_demand[component.id] = {
                    "required_quantity": 0,
                    "required_date": required_date
                }
            
            components_demand[component.id]["required_quantity"] += component_quantity
            # Aktualizacja daty, jeśli bieżąca jest wcześniejsza
            if required_date and (not components_demand[component.id]["required_date"] or 
                                required_date < components_demand[component.id]["required_date"]):
                components_demand[component.id]["required_date"] = required_date
