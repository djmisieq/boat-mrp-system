# Logowanie do systemu MRP

## Domyślne dane logowania

Aplikacja MRP przy pierwszym uruchomieniu automatycznie tworzy domyślne konto administratora.

Dane do logowania:
- **Email**: admin@example.com
- **Hasło**: admin123

## Zmienianie hasła

Po pierwszym zalogowaniu się do systemu, zalecane jest zmienić domyślne hasło administratora. Można to zrobić w panelu użytkownika lub poprzez API.

## Tworzenie dodatkowych użytkowników

Po zalogowaniu się jako administrator, możesz tworzyć nowe konta użytkowników poprzez panel administracyjny lub za pomocą API (endpoint `/api/v1/users/`).

## Rozwiązywanie problemów z logowaniem

Jeśli masz problemy z logowaniem:

1. Upewnij się, że backend i frontend działają poprawnie
2. Sprawdź, czy baza danych jest dostępna
3. Zrestartuj aplikację - domyślne konto administratora jest tworzone przy każdym starcie aplikacji, jeśli nie istnieją żadni użytkownicy

W razie problemów, możesz również użyć endpointu `/api/v1/setup/init-admin` do ręcznego utworzenia administratora, ale tylko jeśli w systemie nie ma jeszcze żadnych użytkowników.
