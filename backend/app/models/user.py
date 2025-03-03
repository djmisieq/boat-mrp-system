from sqlalchemy import Boolean, Column, String
from sqlalchemy.orm import relationship

from app.db.base_class import Base


class User(Base):
    """Model użytkownika w systemie MRP"""
    
    email = Column(String, unique=True, index=True, nullable=False)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    department = Column(String, nullable=True)
    
    # Relacje
    orders = relationship("Order", back_populates="user")
    material_requirements = relationship("MaterialRequirement", back_populates="user")
