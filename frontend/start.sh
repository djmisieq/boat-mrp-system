#!/bin/bash

# Upewnij się, że skrypt ma uprawnienia do wykonania (chmod +x start.sh)

echo "Instalowanie zależności dla frontendu..."
cd "$(dirname "$0")"
npm install

echo "Uruchamianie aplikacji React..."
npm start
