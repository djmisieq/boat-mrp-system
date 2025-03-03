#!/bin/bash

# Skrypt naprawiający problemy z logowaniem w aplikacji MRP
echo "🔧 Naprawianie problemów z logowaniem w aplikacji MRP"
echo ""

# Zmień katalog na główny katalog projektu
cd "$(dirname "$0")"

# Sprawdź, czy Python jest dostępny
if ! command -v python &> /dev/null; then
    echo "❌ Python nie jest zainstalowany lub nie jest dostępny w PATH."
    exit 1
fi

# Zainstaluj niezbędne zależności
echo "📦 Instalowanie niezbędnych zależności..."
pip install requests sqlalchemy pydantic pydantic-settings fastapi

# Zatrzymaj działający backend (jeśli istnieje)
backend_pid=$(ps aux | grep "uvicorn app.main" | grep -v "grep" | awk '{print $2}')
if [ ! -z "$backend_pid" ]; then
    echo "🛑 Zatrzymywanie działającego backendu (PID: $backend_pid)..."
    kill -9 $backend_pid
fi

# Resetuj bazę danych i utwórz administratora
echo "🔄 Resetowanie bazy danych i tworzenie administratora..."
python reset_db.py

# Jeśli resetowanie bazy danych się powiodło, uruchom prostą weryfikację
if [ $? -eq 0 ]; then
    echo ""
    echo "🧪 Testowanie API backendu..."
    
    # Uruchom backend w tle
    echo "🚀 Uruchamianie backendu w tle..."
    python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
    backend_pid=$!
    
    # Poczekaj, aż backend się uruchomi
    echo "⏳ Czekanie na uruchomienie backendu..."
    sleep 5
    
    # Sprawdź, czy backend jest dostępny
    echo "🔍 Sprawdzanie dostępności backendu..."
    if command -v curl &> /dev/null; then
        curl -s http://localhost:8000/api/v1/healthcheck || {
            echo "❌ Backend nie jest dostępny."
            echo "🔴 Naprawa nie powiodła się."
            echo "👉 Spróbuj uruchomić backend ręcznie: python -m uvicorn app.main:app --host 0.0.0.0 --port 8000"
            echo "👉 Następnie uruchom frontend: cd ../frontend && npm start"
            exit 1
        }
        
        echo "✅ Backend działa poprawnie."
        
        # Testowanie logowania
        echo "🔑 Testowanie logowania administratora..."
        curl -s -X POST "http://localhost:8000/api/v1/auth/login" \
            -H "Content-Type: application/x-www-form-urlencoded" \
            -d "username=admin@example.com&password=admin123" > login_test.json
        
        if grep -q "access_token" login_test.json; then
            echo "✅ Logowanie działa poprawnie! Token dostępu został wygenerowany."
            echo "🟢 Naprawa zakończona powodzeniem."
            echo ""
            echo "🔐 Dane logowania administratora:"
            echo "   Email: admin@example.com"
            echo "   Hasło: admin123"
            echo ""
            echo "🖥️ Możesz teraz uruchomić aplikację:"
            echo "   Backend działa już w tle (PID: $backend_pid)"
            echo "   Uruchom frontend: cd ../frontend && npm start"
            rm login_test.json
        else
            echo "❌ Logowanie nie działa poprawnie."
            echo "🔴 Naprawa nie powiodła się."
            echo "👉 Spróbuj uruchomić backend ręcznie: ./start_sqlite.sh"
            echo "👉 Następnie uruchom frontend: cd ../frontend && npm start"
            kill -9 $backend_pid
            rm login_test.json
            exit 1
        fi
    else
        echo "❓ Nie można przetestować API - brak narzędzia curl."
        echo "🟡 Naprawa może się powieść, ale nie można zweryfikować."
        echo "👉 Uruchom backend: ./start_sqlite.sh"
        echo "👉 Następnie uruchom frontend: cd ../frontend && npm start"
    fi
else
    echo "❌ Resetowanie bazy danych nie powiodło się."
    echo "🔴 Naprawa nie powiodła się."
    exit 1
fi
