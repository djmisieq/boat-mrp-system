"""
Skrypt do bezpośredniego tworzenia tabel w bazie danych.
Używać tylko w środowisku deweloperskim gdy migracje Alembic nie działają.
"""
from app.db.base import Base
from app.db.session import engine
from app.db.init_db import init_db
from app.db.session import SessionLocal

# Importy modeli, aby zostały uwzględnione w metadata
from app.models.user import User
from app.models.product import Product
from app.models.bom import BOM
from app.models.order import Order

def create_tables():
    print("Tworzenie tabel w bazie danych...")
    Base.metadata.create_all(bind=engine)
    print("Tabele zostały utworzone.")
    
    # Inicjalizacja podstawowych danych
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    print("Podstawowe dane zostały zainicjowane.")

if __name__ == "__main__":
    create_tables()
