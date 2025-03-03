#!/bin/bash

# Skrypt do szybkiego uruchomienia całej aplikacji (backend + frontend) w Codespaces
echo "🚀 Uruchamianie aplikacji MRP dla produkcji łodzi..."
echo ""

# Zmiana na główny katalog projektu
cd "$(dirname "$0")"

# Sprawdzenie, czy Tmux jest zainstalowany
if ! command -v tmux &> /dev/null; then
    echo "🔧 Instalacja Tmux..."
    sudo apt-get update && sudo apt-get install -y tmux
fi

# Nazwa sesji Tmux
SESSION_NAME="mrp-app"

# Zamknięcie istniejącej sesji, jeśli istnieje
tmux kill-session -t $SESSION_NAME 2>/dev/null

# Utworzenie nowej sesji Tmux
tmux new-session -d -s $SESSION_NAME

# Okno dla backendu
tmux rename-window -t $SESSION_NAME:0 'backend'
tmux send-keys -t $SESSION_NAME:0 "cd backend && chmod +x start_sqlite.sh && ./start_sqlite.sh" C-m

# Nowe okno dla frontendu
tmux new-window -t $SESSION_NAME:1 -n 'frontend'
tmux send-keys -t $SESSION_NAME:1 "cd frontend && chmod +x start.sh && ./start.sh" C-m

# Wyświetlanie informacji
echo "✅ Aplikacja została uruchomiona w sesji Tmux:"
echo "   - Backend (okno 0): http://localhost:8000"
echo "   - Frontend (okno 1): http://localhost:3000"
echo ""
echo "🔍 Aby zobaczyć logi i zarządzać aplikacją:"
echo "   tmux attach -t $SESSION_NAME"
echo ""
echo "🔄 Przełączanie między oknami: CTRL+B, a następnie numer okna (0 lub 1)"
echo "🚪 Odłączenie od sesji: CTRL+B, następnie D (sesja będzie działać w tle)"
echo "❌ Zamknięcie aplikacji: tmux kill-session -t $SESSION_NAME"
echo ""
echo "📊 Dashboard aplikacji dostępny pod adresem: http://localhost:3000"
echo "📝 Dokumentacja API dostępna pod adresem: http://localhost:8000/docs"
echo ""

# Dołączenie do sesji Tmux
tmux attach -t $SESSION_NAME
