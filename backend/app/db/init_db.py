from sqlalchemy.orm import Session

from app.core.auth import get_password_hash
from app.models.user import User
from app.models.product import Product, ProductType


# Funkcja inicjalizująca domyślne dane w bazie danych
def init_db(db: Session) -> None:
    """
    Inicjalizacja bazy danych domyślnymi danymi.
    Tworzy domyślnego użytkownika administratora, jeśli baza nie zawiera żadnych użytkowników.
    """
    # Sprawdź, czy istnieje już jakikolwiek użytkownik
    user_count = db.query(User).count()
    if user_count > 0:
        print("Użytkownicy już istnieją w bazie danych.")
    else:
        # Utwórz domyślnego administratora
        default_admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            first_name="Admin",
            last_name="System",
            department="IT",
            is_active=True,
            is_superuser=True,
        )
        
        db.add(default_admin)
        db.commit()
        db.refresh(default_admin)
        
        print("Utworzono domyślnego administratora:")
        print("Email: admin@example.com")
        print("Hasło: admin123")
    
    # Sprawdź, czy istnieją jakiekolwiek produkty
    product_count = db.query(Product).count()
    if product_count > 0:
        print("Produkty już istnieją w bazie danych.")
    else:
        # Dodaj przykładowe produkty
        example_products = [
            Product(
                code="HUL-001",
                name="Kadłub 5m",
                description="Standardowy kadłub o długości 5 metrów z włókna szklanego",
                product_type=ProductType.COMPONENT,
                unit="szt",
                price=12000,
                quantity_in_stock=5,
                minimum_stock=2,
                lead_time_days=30,
                active=True
            ),
            Product(
                code="ENG-001",
                name="Silnik 100KM",
                description="Silnik zaburtowy o mocy 100KM",
                product_type=ProductType.COMPONENT,
                unit="szt",
                price=25000,
                quantity_in_stock=3,
                minimum_stock=1,
                lead_time_days=45,
                active=True
            ),
            Product(
                code="BOAT-001",
                name="Łódź Sport 5m",
                description="Sportowa łódź motorowa o długości 5 metrów",
                product_type=ProductType.FINAL,
                unit="szt",
                price=85000,
                quantity_in_stock=1,
                minimum_stock=0,
                lead_time_days=60,
                active=True
            ),
            Product(
                code="WOOD-001",
                name="Drewno tekowe",
                description="Wysokiej jakości drewno tekowe do wykończenia łodzi",
                product_type=ProductType.MATERIAL,
                unit="m²",
                price=350,
                quantity_in_stock=120,
                minimum_stock=50,
                lead_time_days=20,
                active=True
            ),
            Product(
                code="PAINT-001",
                name="Farba podkładowa",
                description="Farba podkładowa do użytku morskiego",
                product_type=ProductType.MATERIAL,
                unit="l",
                price=45,
                quantity_in_stock=200,
                minimum_stock=100,
                lead_time_days=10,
                active=True
            ),
            Product(
                code="GLASS-001",
                name="Szyba przednia",
                description="Przednia szyba do łodzi motorowej",
                product_type=ProductType.COMPONENT,
                unit="szt",
                price=1200,
                quantity_in_stock=8,
                minimum_stock=3,
                lead_time_days=15,
                active=True
            ),
            Product(
                code="SEAT-001",
                name="Fotel kapitański",
                description="Regulowany fotel kapitański",
                product_type=ProductType.COMPONENT,
                unit="szt",
                price=850,
                quantity_in_stock=12,
                minimum_stock=5,
                lead_time_days=10,
                active=True
            ),
            Product(
                code="STEER-001",
                name="Koło sterowe",
                description="Standardowe koło sterowe",
                product_type=ProductType.COMPONENT,
                unit="szt",
                price=450,
                quantity_in_stock=15,
                minimum_stock=5,
                lead_time_days=7,
                active=True
            ),
            Product(
                code="BOAT-002",
                name="Łódź Wędkarska 4m",
                description="Łódź wędkarska o długości 4 metrów",
                product_type=ProductType.FINAL,
                unit="szt",
                price=65000,
                quantity_in_stock=2,
                minimum_stock=1,
                lead_time_days=45,
                active=True
            ),
            Product(
                code="ENG-002",
                name="Silnik 50KM",
                description="Silnik zaburtowy o mocy 50KM",
                product_type=ProductType.COMPONENT,
                unit="szt",
                price=12000,
                quantity_in_stock=6,
                minimum_stock=2,
                lead_time_days=30,
                active=True
            ),
            Product(
                code="MAINT-001",
                name="Przegląd techniczny",
                description="Standardowy przegląd techniczny łodzi",
                product_type=ProductType.SERVICE,
                unit="usł",
                price=500,
                quantity_in_stock=0,
                minimum_stock=0,
                lead_time_days=1,
                active=True
            ),
            Product(
                code="BOAT-003",
                name="Łódź Kabinowa 7m",
                description="Kabinowa łódź motorowa o długości 7 metrów",
                product_type=ProductType.FINAL,
                unit="szt",
                price=120000,
                quantity_in_stock=1,
                minimum_stock=0,
                lead_time_days=90,
                active=False
            )
        ]
        
        for product in example_products:
            db.add(product)
        
        db.commit()
        print(f"Dodano {len(example_products)} przykładowych produktów do bazy danych.")
