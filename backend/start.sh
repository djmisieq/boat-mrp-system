#!/bin/bash

# Upewnij się, że skrypt ma uprawnienia do wykonania (chmod +x start.sh)

echo "Uruchamianie migracji bazy danych..."
cd /workspace/backend
alembic upgrade head

echo "Uruchamianie aplikacji FastAPI..."
cd /workspace/backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
