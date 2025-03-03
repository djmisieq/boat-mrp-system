from typing import Optional, List, Any, Dict
from datetime import datetime
from pydantic import BaseModel, Field

from app.models.material_requirement import MaterialRequirementStatus


# Schematy dla MaterialRequirementItem
class MaterialRequirementItemBase(BaseModel):
    product_id: int
    required_quantity: float
    available_quantity: float = 0.0
    quantity_to_procure: float
    requirement_date: Optional[datetime] = None
    planned_order_date: Optional[datetime] = None
    is_available: bool = False
    notes: Optional[str] = None


class MaterialRequirementItemCreate(MaterialRequirementItemBase):
    pass


class MaterialRequirementItemUpdate(MaterialRequirementItemBase):
    pass


class MaterialRequirementItemInDBBase(MaterialRequirementItemBase):
    id: int
    material_requirement_id: int

    class Config:
        orm_mode = True


class MaterialRequirementItem(MaterialRequirementItemInDBBase):
    pass


# Schematy dla MaterialRequirementOrder
class MaterialRequirementOrderBase(BaseModel):
    order_id: int


class MaterialRequirementOrderCreate(MaterialRequirementOrderBase):
    pass


class MaterialRequirementOrderInDBBase(MaterialRequirementOrderBase):
    id: int
    material_requirement_id: int

    class Config:
        orm_mode = True


class MaterialRequirementOrder(MaterialRequirementOrderInDBBase):
    pass


# Schematy dla MaterialRequirement
class MaterialRequirementBase(BaseModel):
    reference_number: str
    status: MaterialRequirementStatus = MaterialRequirementStatus.DRAFT
    notes: Optional[str] = None
    consider_stock: bool = True
    consider_min_stock: bool = True
    planning_start_date: datetime
    planning_end_date: Optional[datetime] = None


class MaterialRequirementCreate(MaterialRequirementBase):
    source_orders: List[int] = []  # lista ID zamówień


class MaterialRequirementUpdate(BaseModel):
    reference_number: Optional[str] = None
    status: Optional[MaterialRequirementStatus] = None
    notes: Optional[str] = None
    consider_stock: Optional[bool] = None
    consider_min_stock: Optional[bool] = None
    planning_start_date: Optional[datetime] = None
    planning_end_date: Optional[datetime] = None


class MaterialRequirementInDBBase(MaterialRequirementBase):
    id: int
    creation_date: datetime
    calculation_date: Optional[datetime] = None
    user_id: Optional[int] = None

    class Config:
        orm_mode = True


class MaterialRequirement(MaterialRequirementInDBBase):
    items: List[MaterialRequirementItem] = []
    source_orders: List[MaterialRequirementOrder] = []


class MaterialRequirementWithDetails(MaterialRequirementInDBBase):
    items: List[Dict[str, Any]] = []  # Szczegóły z dołączonymi informacjami o produktach
    source_orders: List[Dict[str, Any]] = []  # Szczegóły z dołączonymi informacjami o zamówieniach
