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

W tej wersji MVP nie ma jeszcze automatycznego tworzenia użytkownika administratora. W kolejnych etapach projektu zostanie to zautomatyzowane.

Tymczasowo, aby utworzyć użytkownika administratora, wykonaj następujące kroki:

1. Otwórz dokumentację API pod adresem: http://localhost:8000/docs
2. Przejdź do sekcji `/users` i wykorzystaj endpoint POST aby utworzyć administratora:

```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "first_name": "Admin",
  "last_name": "System",
  "is_active": true,
  "is_superuser": true
}
```

3. Zaloguj się przez frontend pod adresem http://localhost:3000

## 7. Migracja bazy danych

Jeśli chcesz ręcznie wykonać migrację bazy danych:

```bash
cd backend
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

## 8. Rozwiązywanie problemów

### Problem z połączeniem do bazy danych

Jeśli backend nie może połączyć się z bazą danych, upewnij się, że:

1. Kontener PostgreSQL jest uruchomiony:
   ```bash
   docker ps
   ```

2. Zmienne środowiskowe są poprawnie ustawione:
   ```bash
   export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mrp_db"
   ```

### Problem z uruchomieniem frontendu

Jeśli frontend nie uruchamia się poprawnie, upewnij się, że:

1. Wszystkie zależności są zainstalowane:
   ```bash
   cd frontend
   npm install
   ```

2. Port 3000 jest dostępny i nie jest używany przez inną aplikację
