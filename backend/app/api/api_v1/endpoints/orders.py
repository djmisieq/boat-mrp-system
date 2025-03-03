from typing import Any, List
from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db, get_current_active_user
from app.models.user import User
from app.models.order import Order, OrderItem, OrderStatus, OrderType
from app.schemas.order import Order as OrderSchema, OrderCreate, OrderUpdate, OrderItem as OrderItemSchema

router = APIRouter()


@router.get("/", response_model=List[OrderSchema])
def read_orders(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
    status: OrderStatus = None,
    order_type: OrderType = None,
    from_date: datetime = None,
    to_date: datetime = None,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Pobierz listę zamówień z możliwością filtrowania.
    """
    query = db.query(Order)
    
    # Zastosuj filtry, jeśli zostały podane
    if status:
        query = query.filter(Order.status == status)
    if order_type:
        query = query.filter(Order.order_type == order_type)
    if from_date:
        query = query.filter(Order.order_date >= from_date)
    if to_date:
        query = query.filter(Order.order_date <= to_date)
    
    # Zwykły użytkownik może widzieć tylko swoje zamówienia
    if not current_user.is_superuser:
        query = query.filter(Order.user_id == current_user.id)
    
    orders = query.offset(skip).limit(limit).all()
    return orders


@router.post("/", response_model=OrderSchema)
def create_order(
    *,
    db: Session = Depends(get_db),
    order_in: OrderCreate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Utwórz nowe zamówienie.
    """
    # Sprawdź czy zamówienie o tym numerze już istnieje
    existing_order = db.query(Order).filter(Order.order_number == order_in.order_number).first()
    if existing_order:
        raise HTTPException(
            status_code=400,
            detail="Zamówienie o tym numerze już istnieje.",
        )
    
    # Utwórz nowe zamówienie
    order = Order(
        order_number=order_in.order_number,
        order_type=order_in.order_type,
        status=order_in.status,
        customer_name=order_in.customer_name,
        customer_reference=order_in.customer_reference,
        order_date=order_in.order_date or datetime.utcnow(),
        required_date=order_in.required_date,
        estimated_completion_date=order_in.estimated_completion_date,
        actual_completion_date=order_in.actual_completion_date,
        notes=order_in.notes,
        user_id=current_user.id,
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # Dodaj elementy zamówienia, jeśli zostały podane
    if order_in.items:
        for idx, item_in in enumerate(order_in.items):
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_in.product_id,
                quantity=item_in.quantity,
                unit_price=item_in.unit_price,
                position=item_in.position or idx + 1,
                notes=item_in.notes,
            )
            db.add(order_item)
        db.commit()
        db.refresh(order)
    
    return order


@router.get("/{order_id}", response_model=OrderSchema)
def read_order(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Pobierz informacje o konkretnym zamówieniu.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Zamówienie nie zostało znalezione",
        )
    
    # Sprawdź uprawnienia - tylko administrator może widzieć wszystkie zamówienia
    if not current_user.is_superuser and order.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Brak uprawnień do wyświetlenia tego zamówienia",
        )
    
    return order


@router.put("/{order_id}", response_model=OrderSchema)
def update_order(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    order_in: OrderUpdate,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Aktualizuj zamówienie.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Zamówienie nie zostało znalezione",
        )
    
    # Sprawdź uprawnienia - tylko właściciel lub administrator może edytować zamówienie
    if not current_user.is_superuser and order.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Brak uprawnień do edycji tego zamówienia",
        )
    
    # Aktualizuj główne dane zamówienia
    update_data = order_in.dict(exclude={"items"}, exclude_unset=True)
    for field in update_data:
        setattr(order, field, update_data[field])
    
    # Jeśli podane są elementy, zaktualizuj je
    if order_in.items is not None:
        # Usuń istniejące elementy
        db.query(OrderItem).filter(OrderItem.order_id == order_id).delete()
        
        # Dodaj nowe elementy
        for idx, item_in in enumerate(order_in.items):
            order_item = OrderItem(
                order_id=order.id,
                product_id=item_in.product_id,
                quantity=item_in.quantity,
                unit_price=item_in.unit_price,
                position=item_in.position or idx + 1,
                notes=item_in.notes,
            )
            db.add(order_item)
    
    db.add(order)
    db.commit()
    db.refresh(order)
    return order


@router.delete("/{order_id}", response_model=OrderSchema)
def delete_order(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Usuń zamówienie.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Zamówienie nie zostało znalezione",
        )
    
    # Sprawdź uprawnienia - tylko właściciel lub administrator może usunąć zamówienie
    if not current_user.is_superuser and order.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Brak uprawnień do usunięcia tego zamówienia",
        )
    
    db.delete(order)
    db.commit()
    return order


@router.post("/{order_id}/status", response_model=OrderSchema)
def update_order_status(
    *,
    db: Session = Depends(get_db),
    order_id: int,
    status: OrderStatus,
    current_user: User = Depends(get_current_active_user),
) -> Any:
    """
    Aktualizuj status zamówienia.
    """
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(
            status_code=404,
            detail="Zamówienie nie zostało znalezione",
        )
    
    # Sprawdź uprawnienia
    if not current_user.is_superuser and order.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="Brak uprawnień do aktualizacji statusu tego zamówienia",
        )
    
    order.status = status
    if status == OrderStatus.COMPLETED:
        order.actual_completion_date = datetime.utcnow()
    
    db.add(order)
    db.commit()
    db.refresh(order)
    return order
