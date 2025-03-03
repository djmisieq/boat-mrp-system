from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app import schemas
from app.api import deps
from app.core.mrp import calculate_mrp
from app.models.material_requirement import MaterialRequirement, MaterialRequirementItem, MaterialRequirementOrder, MaterialRequirementStatus
from app.models.order import Order, OrderStatus
from app.models.product import Product
from app.models.user import User
from datetime import datetime, timedelta
import uuid

router = APIRouter()


@router.get("/", response_model=List[schemas.MaterialRequirement])
def read_material_requirements(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    status: Optional[MaterialRequirementStatus] = None,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Pobierz listę zapotrzebowań materiałowych.
    """
    if current_user.is_superuser:
        query = db.query(MaterialRequirement)
        if status:
            query = query.filter(MaterialRequirement.status == status)
        material_requirements = query.offset(skip).limit(limit).all()
    else:
        query = db.query(MaterialRequirement).filter(MaterialRequirement.user_id == current_user.id)
        if status:
            query = query.filter(MaterialRequirement.status == status)
        material_requirements = query.offset(skip).limit(limit).all()
    
    return material_requirements


@router.post("/", response_model=schemas.MaterialRequirement)
def create_material_requirement(
    *,
    db: Session = Depends(deps.get_db),
    material_requirement_in: schemas.MaterialRequirementCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Utwórz nowe zapotrzebowanie materiałowe.
    """
    # Generuj unikalne oznaczenie, jeśli nie podano
    if not material_requirement_in.reference_number:
        material_requirement_in.reference_number = f"MRP-{datetime.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    
    # Sprawdź, czy nie istnieje już zapotrzebowanie o takim samym numerze
    db_req = db.query(MaterialRequirement).filter(
        MaterialRequirement.reference_number == material_requirement_in.reference_number
    ).first()
    if db_req:
        raise HTTPException(
            status_code=400,
            detail="Zapotrzebowanie materiałowe o takim numerze już istnieje."
        )
    
    # Utwórz nowe zapotrzebowanie materiałowe
    db_requirement = MaterialRequirement(
        reference_number=material_requirement_in.reference_number,
        status=material_requirement_in.status,
        notes=material_requirement_in.notes,
        consider_stock=material_requirement_in.consider_stock,
        consider_min_stock=material_requirement_in.consider_min_stock,
        planning_start_date=material_requirement_in.planning_start_date,
        planning_end_date=material_requirement_in.planning_end_date,
        user_id=current_user.id
    )
    db.add(db_requirement)
    db.flush()  # Zapisz, aby uzyskać ID
    
    # Dodaj powiązania z zamówieniami
    for order_id in material_requirement_in.source_orders:
        # Sprawdź, czy zamówienie istnieje
        order = db.query(Order).get(order_id)
        if not order:
            db.rollback()
            raise HTTPException(
                status_code=404,
                detail=f"Zamówienie o ID {order_id} nie zostało znalezione."
            )
        
        # Dodaj powiązanie
        db_order_link = MaterialRequirementOrder(
            material_requirement_id=db_requirement.id,
            order_id=order_id
        )
        db.add(db_order_link)
    
    db.commit()
    db.refresh(db_requirement)
    
    return db_requirement


@router.get("/{material_requirement_id}", response_model=schemas.MaterialRequirement)
def read_material_requirement(
    *,
    db: Session = Depends(deps.get_db),
    material_requirement_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Pobierz szczegóły zapotrzebowania materiałowego.
    """
    material_requirement = db.query(MaterialRequirement).filter(
        MaterialRequirement.id == material_requirement_id
    ).first()
    
    if not material_requirement:
        raise HTTPException(
            status_code=404, 
            detail="Zapotrzebowanie materiałowe nie zostało znalezione."
        )
    
    if not current_user.is_superuser and material_requirement.user_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Brak uprawnień do tego zapotrzebowania materiałowego."
        )
    
    return material_requirement


@router.patch("/{material_requirement_id}", response_model=schemas.MaterialRequirement)
def update_material_requirement(
    *,
    db: Session = Depends(deps.get_db),
    material_requirement_id: int,
    material_requirement_in: schemas.MaterialRequirementUpdate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Aktualizuj zapotrzebowanie materiałowe.
    """
    material_requirement = db.query(MaterialRequirement).filter(
        MaterialRequirement.id == material_requirement_id
    ).first()
    
    if not material_requirement:
        raise HTTPException(
            status_code=404, 
            detail="Zapotrzebowanie materiałowe nie zostało znalezione."
        )
    
    if not current_user.is_superuser and material_requirement.user_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Brak uprawnień do edycji tego zapotrzebowania materiałowego."
        )
    
    # Aktualizuj pola
    update_data = material_requirement_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(material_requirement, field, value)
    
    db.commit()
    db.refresh(material_requirement)
    
    return material_requirement


@router.delete("/{material_requirement_id}")
def delete_material_requirement(
    *,
    db: Session = Depends(deps.get_db),
    material_requirement_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Usuń zapotrzebowanie materiałowe.
    """
    material_requirement = db.query(MaterialRequirement).filter(
        MaterialRequirement.id == material_requirement_id
    ).first()
    
    if not material_requirement:
        raise HTTPException(
            status_code=404, 
            detail="Zapotrzebowanie materiałowe nie zostało znalezione."
        )
    
    if not current_user.is_superuser and material_requirement.user_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Brak uprawnień do usunięcia tego zapotrzebowania materiałowego."
        )
    
    # Usuń powiązane elementy
    db.query(MaterialRequirementItem).filter(
        MaterialRequirementItem.material_requirement_id == material_requirement_id
    ).delete()
    
    db.query(MaterialRequirementOrder).filter(
        MaterialRequirementOrder.material_requirement_id == material_requirement_id
    ).delete()
    
    db.delete(material_requirement)
    db.commit()
    
    return {"status": "success", "message": "Zapotrzebowanie materiałowe zostało usunięte."}


@router.post("/{material_requirement_id}/calculate", response_model=schemas.MaterialRequirement)
def calculate_material_requirement(
    *,
    db: Session = Depends(deps.get_db),
    material_requirement_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Oblicz zapotrzebowanie materiałowe na podstawie powiązanych zamówień.
    """
    material_requirement = db.query(MaterialRequirement).filter(
        MaterialRequirement.id == material_requirement_id
    ).first()
    
    if not material_requirement:
        raise HTTPException(
            status_code=404, 
            detail="Zapotrzebowanie materiałowe nie zostało znalezione."
        )
    
    if not current_user.is_superuser and material_requirement.user_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Brak uprawnień do obliczenia tego zapotrzebowania materiałowego."
        )
    
    try:
        updated_requirement = calculate_mrp(db, material_requirement_id, current_user.id)
        return updated_requirement
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/{material_requirement_id}/details", response_model=schemas.MaterialRequirementWithDetails)
def read_material_requirement_with_details(
    *,
    db: Session = Depends(deps.get_db),
    material_requirement_id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Pobierz szczegóły zapotrzebowania materiałowego wraz z dodatkowymi informacjami o produktach i zamówieniach.
    """
    material_requirement = db.query(MaterialRequirement).filter(
        MaterialRequirement.id == material_requirement_id
    ).first()
    
    if not material_requirement:
        raise HTTPException(
            status_code=404, 
            detail="Zapotrzebowanie materiałowe nie zostało znalezione."
        )
    
    if not current_user.is_superuser and material_requirement.user_id != current_user.id:
        raise HTTPException(
            status_code=403, 
            detail="Brak uprawnień do tego zapotrzebowania materiałowego."
        )
    
    # Pobierz szczegóły elementów zapotrzebowania
    items_with_details = []
    for item in material_requirement.items:
        product = db.query(Product).get(item.product_id)
        if product:
            items_with_details.append({
                "id": item.id,
                "product_id": item.product_id,
                "product_code": product.code,
                "product_name": product.name,
                "product_type": product.product_type,
                "required_quantity": item.required_quantity,
                "available_quantity": item.available_quantity,
                "quantity_to_procure": item.quantity_to_procure,
                "requirement_date": item.requirement_date,
                "planned_order_date": item.planned_order_date,
                "is_available": item.is_available,
                "unit": product.unit,
                "lead_time_days": product.lead_time_days,
                "notes": item.notes
            })
    
    # Pobierz szczegóły zamówień źródłowych
    orders_with_details = []
    for order_link in material_requirement.source_orders:
        order = db.query(Order).get(order_link.order_id)
        if order:
            orders_with_details.append({
                "id": order_link.id,
                "order_id": order.id,
                "order_number": order.order_number,
                "status": order.status,
                "required_date": order.required_date,
                "order_date": order.order_date
            })
    
    # Utwórz odpowiedź
    result = {
        "id": material_requirement.id,
        "reference_number": material_requirement.reference_number,
        "status": material_requirement.status,
        "creation_date": material_requirement.creation_date,
        "calculation_date": material_requirement.calculation_date,
        "notes": material_requirement.notes,
        "consider_stock": material_requirement.consider_stock,
        "consider_min_stock": material_requirement.consider_min_stock,
        "planning_start_date": material_requirement.planning_start_date,
        "planning_end_date": material_requirement.planning_end_date,
        "user_id": material_requirement.user_id,
        "items": items_with_details,
        "source_orders": orders_with_details
    }
    
    return result
