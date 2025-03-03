#!/bin/bash

# Skrypt bezpośrednio uruchamiający aplikację z SQLite bez użycia migracji Alembic
# Używaj tego skryptu, gdy masz problemy z połączeniem do PostgreSQL

echo "Uruchamianie aplikacji z bazą SQLite (z pominięciem migracji Alembic)..."
echo "Tabele zostaną utworzone automatycznie, jeśli nie istnieją."

# Ustawienie zmiennej środowiskowej dla detekcji Codespaces
export CODESPACES=true

# Uruchomienie skryptu, który tworzy tabele i uruchamia aplikację
python run_app.py
