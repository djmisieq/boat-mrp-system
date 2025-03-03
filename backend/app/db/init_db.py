from sqlalchemy.orm import Session

from app.core.auth import get_password_hash
from app.models.user import User


# Funkcja inicjalizująca domyślne dane w bazie danych
def init_db(db: Session) -> None:
    """
    Inicjalizacja bazy danych domyślnymi danymi.
    Tworzy domyślnego użytkownika administratora, jeśli baza nie zawiera żadnych użytkowników.
    """
    # Sprawdź, czy istnieje już jakikolwiek użytkownik
    user_count = db.query(User).count()
    if user_count > 0:
        return  # Jeśli są już jacyś użytkownicy, nie dodawaj domyślnego administratora
    
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
