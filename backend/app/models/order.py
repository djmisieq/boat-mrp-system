from sqlalchemy import Column, String, Float, Integer, ForeignKey, DateTime, Text, Enum
from sqlalchemy.orm import relationship
import enum
from datetime import datetime

from app.db.base_class import Base


class OrderStatus(str, enum.Enum):
    """Status zamówienia produkcyjnego"""
    DRAFT = "draft"  # Szkic zamówienia
    SUBMITTED = "submitted"  # Zamówienie złożone
    CONFIRMED = "confirmed"  # Zamówienie potwierdzone
    IN_PRODUCTION = "in_production"  # W trakcie produkcji
    COMPLETED = "completed"  # Ukończone
    CANCELLED = "cancelled"  # Anulowane


class OrderType(str, enum.Enum):
    """Typ zamówienia"""
    PRODUCTION = "production"  # Zamówienie produkcyjne
    PURCHASE = "purchase"  # Zamówienie zakupu


class Order(Base):
    """Model zamówienia w systemie MRP"""
    
    order_number = Column(String, unique=True, index=True, nullable=False)
    order_type = Column(Enum(OrderType), nullable=False, default=OrderType.PRODUCTION)
    status = Column(Enum(OrderStatus), nullable=False, default=OrderStatus.DRAFT)
    customer_name = Column(String, nullable=True)
    customer_reference = Column(String, nullable=True)
    order_date = Column(DateTime, default=datetime.utcnow)
    required_date = Column(DateTime, nullable=True)
    estimated_completion_date = Column(DateTime, nullable=True)
    actual_completion_date = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)
    
    # Relacje
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    user = relationship("User", back_populates="orders")


class OrderItem(Base):
    """Pozycja w zamówieniu"""
    
    order_id = Column(Integer, ForeignKey("order.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("product.id"), nullable=False)
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=True)
    position = Column(Integer, nullable=True)
    notes = Column(Text, nullable=True)
    
    # Relacje
    order = relationship("Order", back_populates="items")
    product = relationship("Product", back_populates="order_items")
