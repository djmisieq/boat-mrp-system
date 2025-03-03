#!/bin/bash

# Skrypt do konfiguracji środowiska w Codespaces

echo "Instalowanie zależności Python..."
pip install -r requirements.txt

echo "Instalowanie modułu 'app' w trybie deweloperskim..."
pip install -e .

echo "Konfiguracja zakończona. Teraz możesz uruchomić aplikację za pomocą ./start.sh"
