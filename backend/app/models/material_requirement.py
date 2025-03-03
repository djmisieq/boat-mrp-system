from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Text, Enum, Boolean
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.db.base_class import Base


class MaterialRequirementStatus(str, enum.Enum):
    """Status zapotrzebowania materiałowego"""
    DRAFT = "draft"  # Projekt zapotrzebowania
    CALCULATED = "calculated"  # Obliczone zapotrzebowanie
    PROCESSING = "processing"  # W trakcie realizacji
    COMPLETED = "completed"  # Zrealizowane
    CANCELLED = "cancelled"  # Anulowane


class MaterialRequirement(Base):
    """Model zapotrzebowania materiałowego w systemie MRP"""
    
    reference_number = Column(String, unique=True, index=True, nullable=False)
    status = Column(Enum(MaterialRequirementStatus), nullable=False, default=MaterialRequirementStatus.DRAFT)
    creation_date = Column(DateTime, default=datetime.utcnow)
    calculation_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    
    # Pole wskazujące, czy zapotrzebowanie uwzględnia stany magazynowe
    consider_stock = Column(Boolean, default=True)
    
    # Pole wskazujące, czy zapotrzebowanie uwzględnia minimalne stany magazynowe
    consider_min_stock = Column(Boolean, default=True)
    
    # Pola powiązane z horyzontem planowania
    planning_start_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    planning_end_date = Column(DateTime, nullable=True)
    
    # Relacje
    items = relationship("MaterialRequirementItem", back_populates="material_requirement", cascade="all, delete-orphan")
    user = relationship("User", back_populates="material_requirements")
    
    # Relacja do zamówień, które były podstawą obliczeń
    source_orders = relationship("MaterialRequirementOrder", back_populates="material_requirement")


class MaterialRequirementOrder(Base):
    """Powiązanie zapotrzebowania materiałowego z zamówieniami"""
    
    material_requirement_id = Column(Integer, ForeignKey("materialrequirement.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False)
    
    # Relacje
    material_requirement = relationship("MaterialRequirement", back_populates="source_orders")
    order = relationship("Order")


class MaterialRequirementItem(Base):
    """Pozycja w zapotrzebowaniu materiałowym"""
    
    material_requirement_id = Column(Integer, ForeignKey("materialrequirement.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    
    # Ilość wymagana do produkcji
    required_quantity = Column(Float, nullable=False)
    
    # Ilość dostępna na stanie magazynowym
    available_quantity = Column(Float, default=0.0)
    
    # Ilość do zamówienia/wyprodukowania
    quantity_to_procure = Column(Float, nullable=False)
    
    # Data zapotrzebowania
    requirement_date = Column(DateTime, nullable=True)
    
    # Data planowanego zamówienia (uwzględnia lead time)
    planned_order_date = Column(DateTime, nullable=True)
    
    # Informacja, czy produkt jest dostępny (czy ilość na stanie jest wystarczająca)
    is_available = Column(Boolean, default=False)
    
    # Notatki
    notes = Column(Text, nullable=True)
    
    # Relacje
    material_requirement = relationship("MaterialRequirement", back_populates="items")
    product = relationship("Product")
