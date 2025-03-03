# Zarządzanie produktami

## Informacje ogólne

Moduł zarządzania produktami pozwala na tworzenie, edycję, przeglądanie i usuwanie produktów używanych w procesie produkcji łodzi. Produkty są podstawowymi elementami systemu MRP i stanowią składniki list materiałowych (BOM).

## Typy produktów

System rozróżnia cztery typy produktów:

1. **Produkt końcowy (FINAL)** - gotowy produkt przeznaczony do sprzedaży, np. kompletna łódź
2. **Komponent (COMPONENT)** - część używana do budowy produktów końcowych, np. silnik, kadłub
3. **Materiał (MATERIAL)** - materiał surowy używany w procesie produkcji, np. drewno, farba
4. **Usługa (SERVICE)** - usługa związana z produkcją lub obsługą łodzi, np. przegląd techniczny

## Właściwości produktu

Każdy produkt w systemie posiada następujące właściwości:

- **Kod** - unikalny identyfikator produktu (np. "ENG-001")
- **Nazwa** - nazwa produktu
- **Opis** - opcjonalny opis produktu
- **Typ produktu** - jeden z czterech typów wymienionych powyżej
- **Jednostka miary** - jednostka używana do mierzenia produktu (np. szt, kg, m)
- **Cena** - wartość jednostkowa produktu
- **Stan magazynowy** - aktualna ilość produktu w magazynie
- **Minimalny stan magazynowy** - poziom przy którym należy uzupełnić zapasy
- **Czas dostawy (dni)** - standardowy czas oczekiwania na dostawę od momentu zamówienia
- **Status aktywności** - określa czy produkt jest aktywny (dostępny do użycia w nowych zamówieniach)

## Funkcjonalności modułu

### Lista produktów

Lista produktów wyświetla wszystkie produkty w systemie i umożliwia:
- Filtrowanie po nazwie produktu
- Filtrowanie po typie produktu 
- Sortowanie po różnych kolumnach
- Paginację dla dużej liczby produktów

### Dodawanie produktu

Formularz dodawania produktu zawiera pola dla wszystkich właściwości produktu. Wymagane pola to:
- Kod produktu
- Nazwa produktu
- Typ produktu
- Jednostka miary

### Edycja produktu

Formularz edycji produktu pozwala na modyfikację wszystkich właściwości produktu oprócz kodu (który jest stały po utworzeniu). 

### Usuwanie produktu

Funkcja usuwania produktu pozwala na całkowite usunięcie produktu z systemu. Przed usunięciem wyświetlane jest okno potwierdzenia.

**Uwaga:** Usunięcie produktu może wpłynąć na istniejące listy materiałowe i zamówienia. Zaleca się najpierw sprawdzić, czy produkt nie jest używany w innych częściach systemu.

## Przypadki użycia

1. **Dodawanie nowego modelu łodzi**:
   - Utworzenie nowego produktu typu FINAL
   - Określenie parametrów cenowych i stanów magazynowych
   - Późniejsze utworzenie listy materiałowej (BOM) dla tego modelu

2. **Zarządzanie stanami magazynowymi**:
   - Regularny przegląd aktualnych stanów magazynowych
   - Identyfikacja produktów poniżej minimalnego stanu magazynowego
   - Planowanie zamówień uzupełniających

3. **Wycofywanie produktu z oferty**:
   - Zmiana statusu produktu na nieaktywny zamiast całkowitego usuwania
   - Umożliwia to zachowanie historii i realizację istniejących zamówień

## Integracja z innymi modułami

Moduł zarządzania produktami jest ściśle zintegrowany z innymi częściami systemu MRP:

1. **Listy materiałowe (BOM)** - każda lista materiałowa zawiera odniesienia do produktów (produkt końcowy oraz komponenty/materiały)
2. **Zamówienia** - zamówienia są tworzone dla produktów i wpływają na ich stany magazynowe
3. **Planowanie zasobów** - algorytmy MRP analizują stany magazynowe i czasy dostaw produktów w celu optymalizacji procesu produkcji

## API

Moduł produktów udostępnia następujące endpointy API:

### GET /api/v1/products

Pobiera listę produktów z możliwością filtrowania i paginacji.

**Parametry zapytania:**
- `skip` (opcjonalny) - liczba produktów do pominięcia (do paginacji)
- `limit` (opcjonalny) - maksymalna liczba produktów do pobrania
- `name` (opcjonalny) - filtrowanie po nazwie produktu
- `code` (opcjonalny) - filtrowanie po kodzie produktu
- `product_type` (opcjonalny) - filtrowanie po typie produktu
- `active` (opcjonalny) - filtrowanie po statusie aktywności

### POST /api/v1/products

Tworzy nowy produkt.

**Ciało żądania:**
```json
{
  "code": "string",
  "name": "string",
  "description": "string",
  "product_type": "FINAL | COMPONENT | MATERIAL | SERVICE",
  "unit": "string",
  "price": "number",
  "quantity_in_stock": "number",
  "minimum_stock": "number",
  "lead_time_days": "number",
  "active": "boolean"
}
```

### GET /api/v1/products/{product_id}

Pobiera szczegółowe informacje o konkretnym produkcie.

### PUT /api/v1/products/{product_id}

Aktualizuje istniejący produkt.

**Ciało żądania:**
```json
{
  "name": "string",
  "description": "string",
  "product_type": "FINAL | COMPONENT | MATERIAL | SERVICE",
  "unit": "string",
  "price": "number",
  "quantity_in_stock": "number",
  "minimum_stock": "number",
  "lead_time_days": "number",
  "active": "boolean"
}
```

### DELETE /api/v1/products/{product_id}

Usuwa produkt o podanym identyfikatorze.

## Najlepsze praktyki

1. **Konwencja kodów produktów** - zaleca się stosowanie spójnej konwencji kodów produktów, np.:
   - `BOAT-XXX` dla produktów końcowych (łodzi)
   - `ENG-XXX` dla silników
   - `HULL-XXX` dla kadłubów
   - `MAT-XXX` dla materiałów

2. **Regularne aktualizacje stanów magazynowych** - dla zapewnienia dokładności planowania produkcji

3. **Zarządzanie produktami nieaktywnymi** - zamiast usuwania produktów, lepiej zmienić ich status na nieaktywny, aby zachować historię

4. **Dokładne określanie czasów dostaw** - dokładne czasy dostaw są kluczowe dla poprawnego planowania produkcji

## Przyszły rozwój

Planowane rozszerzenia modułu zarządzania produktami:

1. **Obsługa wariantów produktów** - możliwość definiowania różnych wariantów tego samego produktu
2. **Historia zmian cen** - śledzenie zmian cen produktów w czasie
3. **System kategorii i tagów** - zaawansowane kategoryzowanie i wyszukiwanie produktów
4. **Import/eksport danych produktów** - możliwość masowego importu i eksportu danych
5. **Zarządzanie załącznikami** - możliwość dołączania dokumentacji technicznej, zdjęć i innych plików do produktów
