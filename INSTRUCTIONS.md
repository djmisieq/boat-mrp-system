# Instrukcje uruchomienia projektu w GitHub Codespaces

Ten dokument zawiera instrukcje dotyczące uruchomienia projektu Chmurowego Systemu MRP w środowisku GitHub Codespaces.

## 1. Uruchomienie Codespaces

1. Otwórz repozytorium na GitHub
2. Kliknij zielony przycisk "Code"
3. Wybierz zakładkę "Codespaces"
4. Kliknij "Create codespace on main"
5. Poczekaj na utworzenie i inicjalizację środowiska Codespaces

## 2. Konfiguracja projektu

Po uruchomieniu Codespaces znajdziesz się w środowisku VS Code w przeglądarce, z gotowym repozytorium projektu.

### Nadanie uprawnień do wykonania skryptów startowych

Wykonaj w terminalu:

```bash
chmod +x backend/start.sh
chmod +x frontend/start.sh
```

## 3. Uruchomienie bazy danych PostgreSQL

1. Otwórz terminal w VS Code (Terminal -> New Terminal)
2. Uruchom bazę danych za pomocą Docker Compose:

```bash
cd infrastructure
docker-compose up -d db
```

## 4. Uruchomienie backendu

1. Otwórz nowy terminal
2. Uruchom backend aplikacji:

```bash
cd backend
./start.sh
```

Backend będzie dostępny pod adresem: http://localhost:8000

API Docs: http://localhost:8000/docs

## 5. Uruchomienie frontendu

1. Otwórz kolejny terminal
2. Uruchom frontend aplikacji:

```bash
cd frontend
./start.sh
```

Frontend będzie dostępny pod adresem: http://localhost:3000

## 6. Pierwsze logowanie

Aby utworzyć pierwszego użytkownika administratora, wykonaj następujące kroki:

1. Otwórz dokumentację API pod adresem: http://localhost:8000/docs
2. Przejdź do sekcji `/setup` i wykorzystaj endpoint POST `/setup/init-admin` aby utworzyć administratora:

```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "first_name": "Admin",
  "last_name": "System",
  "is_active": true
}
```

3. Zaloguj się przez frontend pod adresem http://localhost:3000 używając utworzonych danych

**Uwaga:** Endpoint `/setup/init-admin` będzie działał tylko przy pierwszym uruchomieniu, gdy baza danych jest pusta. Po utworzeniu pierwszego użytkownika, nie będzie można już korzystać z tego endpointu.

## 7. Migracja bazy danych

Jeśli chcesz ręcznie wykonać migrację bazy danych:

```bash
cd backend
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

Skrypt `start.sh` dla backendu automatycznie wykonuje migrację (`alembic upgrade head`), więc ten krok zwykle nie jest konieczny.

## 8. Rozwiązywanie problemów

### Problem z połączeniem do bazy danych

Jeśli backend nie może połączyć się z bazą danych, upewnij się, że:

1. Kontener PostgreSQL jest uruchomiony:
   ```bash
   docker ps
   ```

2. Zmienne środowiskowe są poprawnie ustawione:
   ```bash
   export DATABASE_URL="postgresql://postgres:postgres@db:5432/mrp_db"
   ```

### Problem z uruchomieniem frontendu

Jeśli frontend nie uruchamia się poprawnie, upewnij się, że:

1. Wszystkie zależności są zainstalowane:
   ```bash
   cd frontend
   npm install
   ```

2. Port 3000 jest dostępny i nie jest używany przez inną aplikację

### Problem z CORS

Jeśli frontend nie może komunikować się z backendem z powodu błędów CORS, upewnij się, że:

1. Backend ma prawidłowo skonfigurowane dozwolone źródła CORS:
   ```python
   # W pliku backend/app/core/config.py
   BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]
   ```

2. Frontend używa poprawnych adresów URL do backendu (powinno być skonfigurowane przez `proxy` w package.json)
