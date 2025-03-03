from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime
from app.models.order import OrderStatus, OrderType


# Order Item
class OrderItemBase(BaseModel):
    product_id: Optional[int] = None
    quantity: Optional[float] = None
    unit_price: Optional[float] = None
    position: Optional[int] = None
    notes: Optional[str] = None


class OrderItemCreate(OrderItemBase):
    product_id: int
    quantity: float


class OrderItemUpdate(OrderItemBase):
    pass


class OrderItemInDBBase(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True


class OrderItem(OrderItemInDBBase):
    pass


# Order
class OrderBase(BaseModel):
    order_number: Optional[str] = None
    order_type: Optional[OrderType] = OrderType.PRODUCTION
    status: Optional[OrderStatus] = OrderStatus.DRAFT
    customer_name: Optional[str] = None
    customer_reference: Optional[str] = None
    order_date: Optional[datetime] = None
    required_date: Optional[datetime] = None
    estimated_completion_date: Optional[datetime] = None
    actual_completion_date: Optional[datetime] = None
    notes: Optional[str] = None
    user_id: Optional[int] = None


class OrderCreate(OrderBase):
    order_number: str
    items: List[OrderItemCreate] = []


class OrderUpdate(OrderBase):
    items: Optional[List[OrderItemCreate]] = None


class OrderInDBBase(OrderBase):
    id: int
    order_date: datetime

    class Config:
        from_attributes = True


class Order(OrderInDBBase):
    items: List[OrderItem] = []


# Schemat do filtrowania zamówień
class OrderFilter(BaseModel):
    order_number: Optional[str] = None
    order_type: Optional[OrderType] = None
    status: Optional[OrderStatus] = None
    customer_name: Optional[str] = None
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None
    user_id: Optional[int] = None
