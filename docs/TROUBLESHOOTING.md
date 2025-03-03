# Rozwiązywanie problemów z systemem MRP

## Problemy z logowaniem

### Problem: Komunikat "Nieprawidłowy email lub hasło"

Jeśli otrzymujesz komunikat "Nieprawidłowy email lub hasło" mimo używania prawidłowych danych logowania (admin@example.com / admin123), wykonaj następujące kroki:

1. **Sprawdź, czy backend działa poprawnie**:
   ```bash
   cd backend
   python test_api.py
   ```
   Ten skrypt spróbuje zalogować się do systemu i pobrać dane użytkownika. Wyświetli szczegółowe informacje o odpowiedziach z serwera.

2. **Sprawdź, czy domyślny administrator został utworzony**:
   Uruchom backend z włączonym logowaniem:
   ```bash
   cd backend
   ./start_sqlite.sh
   ```
   Powinieneś zobaczyć komunikat "Utworzono domyślnego administratora" w logach.

3. **Wyczyść pamięć podręczną przeglądarki**:
   W przeglądarce otwórz narzędzia deweloperskie (F12), przejdź do zakładki "Application" lub "Storage" i wyczyść dane Local Storage oraz Session Storage.

4. **Upewnij się, że frontend i backend komunikują się poprawnie**:
   W terminalu wykonaj:
   ```bash
   curl -X POST "http://localhost:8000/api/v1/auth/login" \
   -H "Content-Type: application/x-www-form-urlencoded" \
   -d "username=admin@example.com&password=admin123"
   ```
   Powinieneś otrzymać token dostępu.

5. **Restart Codespaces**:
   Czasami restart całego środowiska Codespaces może rozwiązać problemy.

### Problem: Białe okno lub błędy JavaScript w przeglądarce

1. **Sprawdź logi w konsoli przeglądarki**:
   Otwórz narzędzia deweloperskie (F12) i przejdź do zakładki "Console", aby zobaczyć błędy.

2. **Sprawdź, czy wszystkie porty są dostępne**:
   W Codespaces powinny być otwarte porty 8000 (backend) i 3000 (frontend).

## Problemy z bazą danych

### Problem: Błędy SQLite lub brak tabel

1. **Uruchom backend z pominięciem migracji Alembic**:
   ```bash
   cd backend
   chmod +x start_sqlite.sh
   ./start_sqlite.sh
   ```
   Ten skrypt automatycznie tworzy tabele w bazie danych SQLite.

2. **Ręczne utworzenie tabel**:
   ```bash
   cd backend
   python create_tables.py
   ```

3. **Usuń bazę danych i stwórz ją na nowo**:
   ```bash
   cd backend
   rm -f mrp_db.sqlite
   python create_tables.py
   ```

## Problemy z proxy w środowisku deweloperskim

Jeśli frontend nie może połączyć się z backendem, możesz spróbować:

1. **Uruchom frontend z jawnym wskazaniem serwera API**:
   ```bash
   cd frontend
   REACT_APP_API_URL=http://localhost:8000 npm start
   ```

2. **Zainstaluj zależność http-proxy-middleware**:
   ```bash
   cd frontend
   npm install http-proxy-middleware --save
   ```
   (Powinna już być zainstalowana, ale warto sprawdzić)

3. **Użyj bezpośrednich adresów URL w kodzie**:
   W przeglądarce możesz ręcznie wprowadzić taki adres:
   ```
   http://localhost:3000?api=http://localhost:8000
   ```
   to pozwoli fronendowi użyć bezpośredniego adresu do API.
