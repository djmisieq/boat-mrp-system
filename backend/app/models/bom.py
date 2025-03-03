from sqlalchemy import Column, String, Float, Integer, ForeignKey, Boolean, Text
from sqlalchemy.orm import relationship
from typing import List

from app.db.base_class import Base


class BOM(Base):
    """
    Model struktury materiałowej (Bill of Materials)
    Definiuje z jakich komponentów składa się produkt końcowy
    """
    
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    version = Column(String, nullable=False, default="1.0")
    is_active = Column(Boolean, default=True)
    
    # Relacje
    product = relationship("Product", back_populates="bom_parent")
    items = relationship("BOMItem", back_populates="bom", cascade="all, delete-orphan")


class BOMItem(Base):
    """
    Pojedynczy element struktury materiałowej
    """
    
    bom_id = Column(Integer, ForeignKey("bom.id"), nullable=False)
    component_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String, nullable=False, default="pcs")
    position = Column(Integer, nullable=True)  # pozycja na liście składników
    notes = Column(Text, nullable=True)
    is_optional = Column(Boolean, default=False)
    
    # Relacje
    bom = relationship("BOM", back_populates="items")
    component = relationship("Product", back_populates="bom_items")
