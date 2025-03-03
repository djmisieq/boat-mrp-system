from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    """
    Funkcja pomocnicza do uzyskiwania sesji bazy danych.
    Używana jako dependency w endpointach FastAPI.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
