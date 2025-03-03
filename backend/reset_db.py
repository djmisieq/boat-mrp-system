"""
Skrypt resetujący bazę danych i tworzący domyślnego administratora.
Ten skrypt usuwa istniejącą bazę SQLite, tworzy nową z właściwymi tabelami
i dodaje konto administratora.
"""
import os
import sys
from sqlalchemy.exc import SQLAlchemyError

# Dodaj ścieżkę katalogu nadrzędnego do sys.path, aby umożliwić importy
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Importy z aplikacji
from app.db.session import SessionLocal, engine
from app.models.user import User
from app.core.auth import get_password_hash
from app.db.base import Base

def reset_database():
    """Resetuje bazę danych i tworzy domyślnego administratora"""
    
    print("🗑️  Usuwanie istniejącej bazy danych...")
    # Sprawdź, czy plik bazy danych istnieje i usuń go
    db_file = "mrp_db.sqlite"
    if os.path.exists(db_file):
        try:
            os.remove(db_file)
            print(f"✅ Usunięto bazę danych: {db_file}")
        except OSError as e:
            print(f"❌ Błąd podczas usuwania bazy danych: {e}")
            return False
    else:
        print("ℹ️  Baza danych nie istniała, tworzę nową.")

    print("\n🛠️  Tworzenie tabel w bazie danych...")
    try:
        # Utwórz wszystkie tabele
        Base.metadata.create_all(bind=engine)
        print("✅ Tabele zostały utworzone pomyślnie.")
    except SQLAlchemyError as e:
        print(f"❌ Błąd podczas tworzenia tabel: {e}")
        return False

    print("\n👤 Tworzenie konta administratora...")
    try:
        # Utwórz sesję bazodanową
        db = SessionLocal()
        
        # Sprawdź, czy użytkownik już istnieje
        existing_admin = db.query(User).filter(User.email == "admin@example.com").first()
        if existing_admin:
            print("ℹ️  Administrator już istnieje w bazie danych.")
            db.close()
            return True
            
        # Utwórz administratora
        admin = User(
            email="admin@example.com",
            hashed_password=get_password_hash("admin123"),
            first_name="Admin",
            last_name="System",
            department="IT",
            is_active=True,
            is_superuser=True
        )
        
        # Dodaj do bazy danych i zatwierdź zmiany
        db.add(admin)
        db.commit()
        db.close()
        
        print("✅ Administrator został utworzony pomyślnie.")
        print("\n🔑 Dane logowania administratora:")
        print("   Email: admin@example.com")
        print("   Hasło: admin123")
        return True
        
    except SQLAlchemyError as e:
        print(f"❌ Błąd podczas tworzenia administratora: {e}")
        return False

if __name__ == "__main__":
    print("🔄 Rozpoczynam resetowanie bazy danych...\n")
    
    success = reset_database()
    
    if success:
        print("\n✅ Baza danych została zresetowana i zainicjowana pomyślnie.")
        print("🚀 Możesz teraz uruchomić aplikację i zalogować się jako administrator.")
    else:
        print("\n❌ Wystąpiły błędy podczas resetowania bazy danych.")
        sys.exit(1)
