#!/bin/bash

# Upewnij się, że skrypt ma uprawnienia do wykonania (chmod +x start.sh)

echo "Instalowanie zależności dla frontendu..."
cd /workspace/frontend
npm install

echo "Uruchamianie aplikacji React..."
npm start
