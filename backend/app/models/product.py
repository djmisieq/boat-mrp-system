from sqlalchemy import Boolean, Column, String, Float, Integer, Text, Enum
from sqlalchemy.orm import relationship
import enum

from app.db.base_class import Base


class ProductType(str, enum.Enum):
    """Typy produktów w systemie"""
    FINAL = "final"  # Produkt końcowy (łódź)
    COMPONENT = "component"  # Komponent używany do budowy łodzi
    MATERIAL = "material"  # Surowiec
    SERVICE = "service"  # Usługa


class Product(Base):
    """Model produktu w systemie MRP"""
    
    code = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    product_type = Column(Enum(ProductType), nullable=False, default=ProductType.COMPONENT)
    unit = Column(String, nullable=False, default="pcs")  # units, kg, m, m2, itp.
    price = Column(Float, nullable=True)
    quantity_in_stock = Column(Float, default=0.0)
    minimum_stock = Column(Float, default=0.0)
    lead_time_days = Column(Integer, default=0)  # czas oczekiwania na dostawę w dniach
    active = Column(Boolean, default=True)
    
    # Relacje
    bom_parent = relationship("BOM", back_populates="product")
    bom_items = relationship("BOMItem", back_populates="component")
    order_items = relationship("OrderItem", back_populates="product")
