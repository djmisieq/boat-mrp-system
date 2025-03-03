from typing import Optional
from pydantic import BaseModel, EmailStr


# Wspólne właściwości
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    department: Optional[str] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False


# Właściwości podczas tworzenia użytkownika
class UserCreate(UserBase):
    email: EmailStr
    password: str


# Właściwości podczas aktualizacji użytkownika
class UserUpdate(UserBase):
    password: Optional[str] = None


# Właściwości podczas odczytu użytkownika z DB
class UserInDBBase(UserBase):
    id: int

    class Config:
        from_attributes = True


# Dodatkowe właściwości zwracane przez API
class User(UserInDBBase):
    pass


# Dodatkowe właściwości przechowywane w DB
class UserInDB(UserInDBBase):
    hashed_password: str
