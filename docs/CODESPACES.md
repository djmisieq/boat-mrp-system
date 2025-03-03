# Uruchamianie projektu w GitHub Codespaces

Ten dokument zawiera instrukcje dotyczące uruchamiania projektu MRP dla produkcji łodzi w środowisku GitHub Codespaces.

## Przygotowanie środowiska

Po uruchomieniu Codespaces, masz dwie opcje uruchomienia aplikacji:

### Opcja 1: Uruchomienie z PostgreSQL na hoście

1. **Zainstaluj i uruchom PostgreSQL**:
   ```bash
   cd infrastructure
   chmod +x start_postgres.sh
   ./start_postgres.sh
   ```

2. **Uruchom backend**:
   ```bash
   cd ../backend
   chmod +x start.sh
   ./start.sh
   ```

3. **Uruchom frontend** (w nowym terminalu):
   ```bash
   cd frontend
   chmod +x start.sh
   ./start.sh
   ```

### Opcja 2: Uruchomienie z Docker

Jeśli Docker jest dostępny w Twoim środowisku Codespaces, możesz użyć docker-compose:

1. **Zainstaluj docker-compose** (jeśli nie jest zainstalowany):
   ```bash
   sudo apt-get update
   sudo apt-get install -y docker-compose-plugin
   ```

2. **Uruchom kontenery**:
   ```bash
   cd infrastructure
   docker-compose up -d
   ```

3. **Uruchom backend i frontend** jak w Opcji 1.

## Rozwiązywanie problemów

### Problem z ścieżkami

Jeśli napotkasz problemy z ścieżkami w skryptach startowych, możesz ręcznie edytować pliki `start.sh` aby używały relatywnych ścieżek:

```bash
# Dla backendu
sed -i 's:/workspace/backend:.:g' backend/start.sh

# Dla frontendu
sed -i 's:/workspace/frontend:.:g' frontend/start.sh
```

### Problem z Docker

Jeśli Docker nie jest dostępny, użyj Opcji 1 z instalacją PostgreSQL bezpośrednio na hoście.

## Dostęp do aplikacji

Po uruchomieniu:
- Backend (FastAPI) będzie dostępny na porcie 8000
- Frontend (React) będzie dostępny na porcie 3000
- Dokumentacja API będzie dostępna pod adresem `http://localhost:8000/docs`

Możesz również użyć funkcji "Ports" w Codespaces, aby uzyskać dostęp do aplikacji przez przeglądarkę.
