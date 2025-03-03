from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from jose.exceptions import JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.user import User
from app.schemas.token import TokenPayload
from app.core.config import settings

# Zmienna kontrolująca, czy uwierzytelnianie jest wymagane
AUTHENTICATION_REQUIRED = False  # Ustaw na True w środowisku produkcyjnym

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login", auto_error=AUTHENTICATION_REQUIRED
)


def get_db() -> Generator:
    """
    Dependency dla uzyskiwania sesji bazy danych
    """
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)
) -> Optional[User]:
    """
    Dependency do uzyskiwania aktualnego użytkownika na podstawie tokenu JWT
    Jeśli AUTHENTICATION_REQUIRED=False, zwraca testowego administratora lub None
    """
    if not AUTHENTICATION_REQUIRED:
        # W trybie testowym, jeśli token nie został podany lub jest niepoprawny
        # zwracamy domyślnego administratora, jeśli istnieje
        if token is None:
            # Najpierw spróbuj pobrać użytkownika o id=1 (typowy admin)
            test_user = db.query(User).filter(User.id == 1).first()
            if test_user:
                print(f"Używanie testowego użytkownika: {test_user.email}")
                return test_user
                
            # Jeśli nie ma użytkownika o id=1, spróbuj znaleźć pierwszego administratora
            test_user = db.query(User).filter(User.is_superuser == True).first()
            if test_user:
                print(f"Używanie pierwszego znalezionego administratora: {test_user.email}")
                return test_user
                
            # Jeśli nie znaleziono żadnego administratora, spróbuj znaleźć dowolnego użytkownika
            test_user = db.query(User).first()
            if test_user:
                print(f"Używanie pierwszego znalezionego użytkownika: {test_user.email}")
                return test_user
                
            print("Nie znaleziono żadnego użytkownika do uwierzytelnienia testowego")
            return None

    # Standardowa walidacja tokenu, gdy AUTHENTICATION_REQUIRED=True lub token jest podany
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenPayload(**payload)
    except (JWTError, ValidationError):
        if AUTHENTICATION_REQUIRED:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Brak autoryzacji - token niepoprawny",
            )
        return None

    user = db.query(User).filter(User.id == token_data.sub).first()
    if not user:
        if AUTHENTICATION_REQUIRED:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Brak autoryzacji - użytkownik nie istnieje",
            )
        return None
    
    return user


def get_current_active_user(
    current_user: User = Depends(get_current_user),
) -> Optional[User]:
    """
    Dependency do uzyskiwania aktywnego użytkownika
    """
    if AUTHENTICATION_REQUIRED and not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Brak autoryzacji",
        )

    if AUTHENTICATION_REQUIRED and not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Użytkownik nieaktywny",
        )
        
    return current_user


def get_current_active_superuser(
    current_user: User = Depends(get_current_active_user),
) -> Optional[User]:
    """
    Dependency do uzyskiwania aktywnego administratora
    """
    if AUTHENTICATION_REQUIRED:
        if not current_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Brak autoryzacji",
            )
        if not current_user.is_superuser:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Brak wymaganych uprawnień administratora",
            )
            
    return current_user
