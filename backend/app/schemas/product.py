from typing import Optional
from pydantic import BaseModel, Field
from app.models.product import ProductType


# Wspólne właściwości
class ProductBase(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    product_type: Optional[ProductType] = None
    unit: Optional[str] = "pcs"
    price: Optional[float] = None
    quantity_in_stock: Optional[float] = 0.0
    minimum_stock: Optional[float] = 0.0
    lead_time_days: Optional[int] = 0
    active: Optional[bool] = True


# Właściwości podczas tworzenia produktu
class ProductCreate(ProductBase):
    code: str
    name: str
    product_type: ProductType


# Właściwości podczas aktualizacji produktu
class ProductUpdate(ProductBase):
    pass


# Właściwości podczas odczytu produktu z DB
class ProductInDBBase(ProductBase):
    id: int

    class Config:
        from_attributes = True


# Dodatkowe właściwości zwracane przez API
class Product(ProductInDBBase):
    pass


# Schemat do filtrowania produktów
class ProductFilter(BaseModel):
    code: Optional[str] = None
    name: Optional[str] = None
    product_type: Optional[ProductType] = None
    active: Optional[bool] = None
    min_stock: Optional[float] = None
