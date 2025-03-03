from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.product import Product, ProductType
from app.schemas.product import Product as ProductSchema, ProductCreate, ProductUpdate, ProductFilter

router = APIRouter()


@router.get("/", response_model=List[ProductSchema])
def read_products(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    name: str = None,
    code: str = None,
    product_type: ProductType = None,
    active: bool = None,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Pobierz listę produktów z możliwością filtrowania.
    """
    query = db.query(Product)
    
    # Zastosuj filtry, jeśli zostały podane
    if name:
        query = query.filter(Product.name.contains(name))
    if code:
        query = query.filter(Product.code.contains(code))
    if product_type:
        query = query.filter(Product.product_type == product_type)
    if active is not None:
        query = query.filter(Product.active == active)
    
    products = query.offset(skip).limit(limit).all()
    return products


@router.post("/", response_model=ProductSchema)
def create_product(
    *,
    db: Session = Depends(get_db),
    product_in: ProductCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Utwórz nowy produkt.
    """
    # Sprawdź czy produkt o tym kodzie już istnieje
    product = db.query(Product).filter(Product.code == product_in.code).first()
    if product:
        raise HTTPException(
            status_code=400,
            detail="Produkt z tym kodem już istnieje w systemie.",
        )
    
    # Utwórz nowy produkt
    product = Product(
        code=product_in.code,
        name=product_in.name,
        description=product_in.description,
        product_type=product_in.product_type,
        unit=product_in.unit,
        price=product_in.price,
        quantity_in_stock=product_in.quantity_in_stock,
        minimum_stock=product_in.minimum_stock,
        lead_time_days=product_in.lead_time_days,
        active=product_in.active,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/{product_id}", response_model=ProductSchema)
def read_product(
    *,
    db: Session = Depends(get_db),
    product_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Pobierz informacje o konkretnym produkcie.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Produkt nie został znaleziony",
        )
    return product


@router.put("/{product_id}", response_model=ProductSchema)
def update_product(
    *,
    db: Session = Depends(get_db),
    product_id: int,
    product_in: ProductUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Aktualizuj produkt.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Produkt nie został znaleziony",
        )
    
    update_data = product_in.dict(exclude_unset=True)
    for field in update_data:
        setattr(product, field, update_data[field])
    
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", response_model=ProductSchema)
def delete_product(
    *,
    db: Session = Depends(get_db),
    product_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Usuń produkt.
    """
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(
            status_code=404,
            detail="Produkt nie został znaleziony",
        )
    
    db.delete(product)
    db.commit()
    return product
