from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.deps import get_db
from app.core.auth import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate, User as UserSchema

router = APIRouter()


@router.post("/init-admin", response_model=UserSchema)
def create_initial_admin(
    *,
    db: Session = Depends(get_db),
    admin_in: UserCreate,
) -> Any:
    """
    Stwórz początkowego użytkownika administratora.
    
    Ta operacja może być wykonana tylko raz, po uruchomieniu systemu.
    Jeśli w systemie istnieje już jakikolwiek użytkownik, operacja nie powiedzie się.
    """
    # Sprawdź czy istnieje już jakikolwiek użytkownik
    user_count = db.query(User).count()
    if user_count > 0:
        raise HTTPException(
            status_code=400,
            detail="System jest już skonfigurowany. Nie można utworzyć nowego administratora tą metodą.",
        )
    
    # Utwórz użytkownika administratora
    user = User(
        email=admin_in.email,
        hashed_password=get_password_hash(admin_in.password),
        first_name=admin_in.first_name,
        last_name=admin_in.last_name,
        department=admin_in.department,
        is_active=True,
        is_superuser=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
