from typing import Any, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.bom import BOM, BOMItem
from app.schemas.bom import BOM as BOMSchema, BOMCreate, BOMUpdate, BOMItem as BOMItemSchema

router = APIRouter()


@router.get("/", response_model=List[BOMSchema])
def read_boms(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    is_active: bool = None,
    product_id: int = None,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Pobierz listę struktur materiałowych (BOM).
    """
    query = db.query(BOM)
    
    if is_active is not None:
        query = query.filter(BOM.is_active == is_active)
    if product_id:
        query = query.filter(BOM.product_id == product_id)
    
    boms = query.offset(skip).limit(limit).all()
    return boms


@router.post("/", response_model=BOMSchema)
def create_bom(
    *,
    db: Session = Depends(get_db),
    bom_in: BOMCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Utwórz nową strukturę materiałową (BOM).
    """
    # Utwórz nowy BOM
    bom = BOM(
        name=bom_in.name,
        description=bom_in.description,
        product_id=bom_in.product_id,
        version=bom_in.version,
        is_active=bom_in.is_active,
    )
    db.add(bom)
    db.commit()
    db.refresh(bom)
    
    # Dodaj elementy BOM, jeśli zostały podane
    if bom_in.items:
        for item_in in bom_in.items:
            bom_item = BOMItem(
                bom_id=bom.id,
                component_id=item_in.component_id,
                quantity=item_in.quantity,
                unit=item_in.unit,
                position=item_in.position,
                notes=item_in.notes,
                is_optional=item_in.is_optional,
            )
            db.add(bom_item)
        db.commit()
        db.refresh(bom)
    
    return bom


@router.get("/{bom_id}", response_model=BOMSchema)
def read_bom(
    *,
    db: Session = Depends(get_db),
    bom_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Pobierz informacje o konkretnej strukturze materiałowej (BOM).
    """
    bom = db.query(BOM).filter(BOM.id == bom_id).first()
    if not bom:
        raise HTTPException(
            status_code=404,
            detail="Struktura materiałowa nie została znaleziona",
        )
    return bom


@router.put("/{bom_id}", response_model=BOMSchema)
def update_bom(
    *,
    db: Session = Depends(get_db),
    bom_id: int,
    bom_in: BOMUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Aktualizuj strukturę materiałową (BOM).
    """
    bom = db.query(BOM).filter(BOM.id == bom_id).first()
    if not bom:
        raise HTTPException(
            status_code=404,
            detail="Struktura materiałowa nie została znaleziona",
        )
    
    # Aktualizuj główne dane BOM
    update_data = bom_in.dict(exclude={"items"}, exclude_unset=True)
    for field in update_data:
        setattr(bom, field, update_data[field])
    
    # Jeśli podane są elementy, zaktualizuj je
    if bom_in.items is not None:
        # Usuń istniejące elementy
        db.query(BOMItem).filter(BOMItem.bom_id == bom_id).delete()
        
        # Dodaj nowe elementy
        for item_in in bom_in.items:
            bom_item = BOMItem(
                bom_id=bom.id,
                component_id=item_in.component_id,
                quantity=item_in.quantity,
                unit=item_in.unit,
                position=item_in.position,
                notes=item_in.notes,
                is_optional=item_in.is_optional,
            )
            db.add(bom_item)
    
    db.add(bom)
    db.commit()
    db.refresh(bom)
    return bom


@router.delete("/{bom_id}", response_model=BOMSchema)
def delete_bom(
    *,
    db: Session = Depends(get_db),
    bom_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Usuń strukturę materiałową (BOM).
    """
    bom = db.query(BOM).filter(BOM.id == bom_id).first()
    if not bom:
        raise HTTPException(
            status_code=404,
            detail="Struktura materiałowa nie została znaleziona",
        )
    
    db.delete(bom)
    db.commit()
    return bom
