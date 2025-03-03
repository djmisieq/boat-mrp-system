# Konfiguracja projektu w GitHub Codespaces

Ten dokument zawiera instrukcje dotyczące konfiguracji i uruchomienia projektu MRP w środowisku GitHub Codespaces.

## Podstawowe kroki konfiguracji

1. **Pobierz najnowsze zmiany z repozytorium:**
   ```bash
   git pull origin main
   ```

2. **Skonfiguruj środowisko backendu:**
   ```bash
   cd backend
   chmod +x codespaces_setup.sh
   ./codespaces_setup.sh
   ```

   Ten skrypt:
   - Zainstaluje wszystkie zależności Python wymienione w `requirements.txt`
   - Zainstaluje moduł `app` w trybie deweloperskim, aby naprawić problem z importami
   - Zaktualizuje konfigurację, aby używać SQLite zamiast PostgreSQL w środowisku Codespaces

3. **Uruchom backend:**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

4. **Uruchom frontend** (w nowym terminalu):
   ```bash
   cd frontend
   chmod +x start.sh
   ./start.sh
   ```

## Rozwiązywanie problemów

### Problem z modułem `app`

Jeśli nadal widzisz błąd `ModuleNotFoundError: No module named 'app'`, upewnij się, że wykonałeś plik `codespaces_setup.sh`. Możesz też ręcznie zainstalować moduł:

```bash
cd backend
pip install -e .
```

### Problem z bazą danych

Aplikacja automatycznie wykryje, że znajduje się w środowisku Codespaces i będzie używać SQLite zamiast PostgreSQL. Baza danych zostanie utworzona jako plik `mrp_db.sqlite` w katalogu backendu.

### Problem z alembic

Jeśli masz problemy z migracjami, możesz je pominąć i utworzyć nową bazę danych SQLite:

```bash
cd backend
pip install -e .
python -c "from app.db.base import Base; from app.db.session import engine; Base.metadata.create_all(bind=engine)"
```

## Dostęp do aplikacji

Po uruchomieniu:
- Backend (FastAPI) będzie dostępny na porcie 8000
- Frontend (React) będzie dostępny na porcie 3000
- Dokumentacja API będzie dostępna pod adresem `http://localhost:8000/docs`

Możesz również użyć funkcji "Ports" w Codespaces, aby uzyskać dostęp do aplikacji przez przeglądarkę.
