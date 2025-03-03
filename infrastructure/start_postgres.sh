#!/bin/bash

# Skrypt do uruchomienia samej bazy danych PostgreSQL bez docker-compose
# Użycie: chmod +x start_postgres.sh && ./start_postgres.sh

echo "Instalowanie PostgreSQL..."
sudo apt-get update
sudo apt-get install -y postgresql postgresql-contrib

echo "Konfigurowanie bazy danych..."
sudo service postgresql start
sudo -u postgres psql -c "CREATE DATABASE mrp_db;"
sudo -u postgres psql -c "CREATE USER postgres WITH ENCRYPTED PASSWORD 'postgres';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE mrp_db TO postgres;"

echo "Baza danych PostgreSQL uruchomiona i skonfigurowana"
echo "Możesz teraz uruchomić backend i frontend"
