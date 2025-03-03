# Architektura systemu MRP

## Przegląd

System MRP jest zbudowany w architekturze mikroserwisowej, gdzie backend i frontend są rozdzielone.

### Backend

- FastAPI (Python)
- PostgreSQL jako główna baza danych
- RESTful API

### Frontend

- React.js
- React Router dla nawigacji
- Axios dla komunikacji z API

## Przepływ danych

1. Użytkownik (produkcja, logistyka, zakupy) składa zapytanie poprzez frontend
2. Frontend wysyła żądanie do API
3. Backend przetwarza żądanie, pobiera dane z bazy, oblicza zapotrzebowanie
4. Baza danych przechowuje BOM, harmonogramy produkcji i status dostaw
5. System wysyła notyfikacje w zależności od wyników planowania
