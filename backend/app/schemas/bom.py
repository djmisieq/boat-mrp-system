from typing import List, Optional
from pydantic import BaseModel


# BOM Item
class BOMItemBase(BaseModel):
    component_id: Optional[int] = None
    quantity: Optional[float] = None
    unit: Optional[str] = "pcs"
    position: Optional[int] = None
    notes: Optional[str] = None
    is_optional: Optional[bool] = False


class BOMItemCreate(BOMItemBase):
    component_id: int
    quantity: float


class BOMItemUpdate(BOMItemBase):
    pass


class BOMItemInDBBase(BOMItemBase):
    id: int
    bom_id: int

    class Config:
        from_attributes = True


class BOMItem(BOMItemInDBBase):
    pass


# BOM
class BOMBase(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    product_id: Optional[int] = None
    version: Optional[str] = "1.0"
    is_active: Optional[bool] = True


class BOMCreate(BOMBase):
    name: str
    product_id: int
    items: List[BOMItemCreate] = []


class BOMUpdate(BOMBase):
    items: Optional[List[BOMItemCreate]] = None


class BOMInDBBase(BOMBase):
    id: int

    class Config:
        from_attributes = True


class BOM(BOMInDBBase):
    items: List[BOMItem] = []
