from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.config import settings
from app.core.auth import ALGORITHM
from app.schemas.token import TokenPayload
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_V1_STR}/auth/login")


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> User:
    """
    Zweryfikuj token JWT i zwróć użytkownika
    """
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Nie można zweryfikować poświadczeń",
        )
    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        raise HTTPException(status_code=404, detail="Użytkownik nie został znaleziony")
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Użytkownik nieaktywny")
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Sprawdź czy użytkownik jest aktywny
    """
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Użytkownik nieaktywny")
    return current_user


def get_current_active_superuser(
    current_user: User = Depends(get_current_user),
) -> User:
    """
    Sprawdź czy użytkownik jest administratorem
    """
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=400, detail="Użytkownik nie ma wystarczających uprawnień"
        )
    return current_user
