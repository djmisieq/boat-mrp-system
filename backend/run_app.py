"""
Skrypt do uruchomienia aplikacji z pominięciem migracji Alembic.
Sprawdzi czy tabele istnieją, a jeśli nie - utworzy je bezpośrednio.
"""
import sys
import os
import importlib.util
import uvicorn

# Sprawdź, czy tabele istnieją
try:
    from app.db.session import SessionLocal
    from app.models.user import User
    
    db = SessionLocal()
    try:
        # Próba odczytu użytkowników, aby sprawdzić, czy tabela istnieje
        users = db.query(User).all()
        print("Tabele w bazie danych już istnieją.")
    except Exception as e:
        print(f"Tabele nie istnieją lub wystąpił inny błąd: {e}")
        print("Tworzenie tabel...")
        
        # Importuj i uruchom skrypt tworzący tabele
        spec = importlib.util.spec_from_file_location("create_tables", 
                                                     os.path.join(os.path.dirname(__file__), "create_tables.py"))
        create_tables_module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(create_tables_module)
        create_tables_module.create_tables()
    finally:
        db.close()
except Exception as e:
    print(f"Błąd podczas sprawdzania/tworzenia tabel: {e}")
    sys.exit(1)

# Uruchom aplikację FastAPI
if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
