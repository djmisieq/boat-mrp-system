#!/bin/bash

# Skrypt do szybkiego uruchamiania aplikacji w trybie testowym (bez uwierzytelniania)
echo "🚀 Uruchamianie aplikacji MRP w trybie testowym (bez uwierzytelniania)..."
echo ""

# Zmiana na główny katalog projektu
cd "$(dirname "$0")"

# Sprawdzenie, czy Tmux jest zainstalowany
if ! command -v tmux &> /dev/null; then
    echo "🔧 Instalacja Tmux..."
    sudo apt-get update && sudo apt-get install -y tmux
fi

# Upewnij się, że mamy najnowszą wersję kodu
echo "📥 Pobieranie najnowszej wersji kodu..."
git pull origin main

# Nazwa sesji Tmux
SESSION_NAME="mrp-test-mode"

# Zamknięcie istniejącej sesji, jeśli istnieje
tmux kill-session -t $SESSION_NAME 2>/dev/null

# Utworzenie nowej sesji Tmux
tmux new-session -d -s $SESSION_NAME

# Okno dla backendu
tmux rename-window -t $SESSION_NAME:0 'backend'
tmux send-keys -t $SESSION_NAME:0 "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload" C-m

# Nowe okno dla frontendu
tmux new-window -t $SESSION_NAME:1 -n 'frontend'
tmux send-keys -t $SESSION_NAME:1 "cd frontend && npm start" C-m

# Wyświetlanie informacji
echo "✅ Aplikacja została uruchomiona w trybie testowym:"
echo "   - Backend (okno 0): http://localhost:8000"
echo "   - Frontend (okno 1): http://localhost:3000"
echo ""
echo "ℹ️  W tym trybie:"
echo "   - Nie jest wymagane uwierzytelnianie"
echo "   - Frontend używa testowego użytkownika administratora"
echo "   - Wszystkie funkcje aplikacji są dostępne bez logowania"
echo ""
echo "🔍 Aby zobaczyć logi i zarządzać aplikacją:"
echo "   tmux attach -t $SESSION_NAME"
echo ""
echo "🔄 Przełączanie między oknami: CTRL+B, a następnie numer okna (0 lub 1)"
echo "🚪 Odłączenie od sesji: CTRL+B, następnie D (sesja będzie działać w tle)"
echo "❌ Zamknięcie aplikacji: tmux kill-session -t $SESSION_NAME"
echo ""
echo "📚 Więcej informacji o trybie testowym: docs/TEST_MODE.md"
echo ""

# Dołączenie do sesji Tmux
tmux attach -t $SESSION_NAME
