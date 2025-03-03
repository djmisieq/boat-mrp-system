# Uruchamianie z SQLite w Codespaces

Ten dokument zawiera instrukcje dotyczące uruchamiania projektu MRP w środowisku GitHub Codespaces z wykorzystaniem SQLite zamiast PostgreSQL.

## Uruchamianie aplikacji

1. **Pobierz najnowsze zmiany z repozytorium:**
   ```bash
   git pull origin main
   ```

2. **Uruchom backend:**
   ```bash
   cd backend
   chmod +x start.sh
   ./start.sh
   ```

   Backend automatycznie użyje bazy danych SQLite zamiast PostgreSQL w środowisku Codespaces.

3. **Uruchom frontend** (w nowym terminalu):
   ```bash
   cd frontend
   chmod +x start.sh
   ./start.sh
   ```

## Ważne informacje

- W środowisku Codespaces, aplikacja automatycznie wykrywa, że znajduje się w Codespaces i używa SQLite zamiast PostgreSQL.
- Baza danych SQLite zostanie utworzona jako plik `mrp_db.sqlite` w katalogu backendu.
- Wszystkie migracje bazodanowe są kompatybilne zarówno z PostgreSQL, jak i SQLite.
- Ta konfiguracja jest zalecana tylko dla środowiska deweloperskiego, w produkcji należy użyć PostgreSQL.

## Dostęp do aplikacji

Po uruchomieniu:
- Backend (FastAPI) będzie dostępny na porcie 8000
- Frontend (React) będzie dostępny na porcie 3000
- Dokumentacja API będzie dostępna pod adresem `http://localhost:8000/docs`

Możesz również użyć funkcji "Ports" w Codespaces, aby uzyskać dostęp do aplikacji przez przeglądarkę.
