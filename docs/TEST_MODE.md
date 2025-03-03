# Tryb testowy bez uwierzytelniania

System MRP został rozszerzony o tryb testowy, który umożliwia korzystanie z aplikacji bez konieczności logowania. Jest to szczególnie przydatne podczas rozwoju i testowania funkcjonalności, gdy nie chcemy tracić czasu na proces uwierzytelniania.

## Jak działa tryb testowy

W trybie testowym:

1. **Backend** nie wymaga tokenów uwierzytelniających dla żądań API
2. **Frontend** automatycznie loguje użytkownika jako testowego administratora
3. Wszystkie zabezpieczone trasy są dostępne bez logowania
4. Na ekranie logowania pojawia się przycisk "Zaloguj się automatycznie"

## Włączanie/wyłączanie trybu testowego

### Frontend

Tryb testowy w frontendzie jest kontrolowany przez zmienną `TEST_MODE` w pliku `frontend/src/contexts/AuthContext.js`:

```javascript
// Flaga trybu testowego - ustaw na false w środowisku produkcyjnym
const TEST_MODE = true;
```

Aby wyłączyć tryb testowy, zmień wartość na `false`.

### Backend

W backendzie tryb testowy jest kontrolowany przez zmienną `AUTHENTICATION_REQUIRED` w pliku `backend/app/api/deps.py`:

```python
# Zmienna kontrolująca, czy uwierzytelnianie jest wymagane
AUTHENTICATION_REQUIRED = False  # Ustaw na True w środowisku produkcyjnym
```

Aby wyłączyć tryb testowy i wymagać uwierzytelniania, zmień wartość na `True`.

## Bezpieczeństwo

**WAŻNE:** Tryb testowy powinien być używany **WYŁĄCZNIE** w środowisku deweloperskim i nigdy w produkcji. Przed wdrożeniem do środowiska produkcyjnego upewnij się, że tryb testowy jest wyłączony:

1. `TEST_MODE = false` w `AuthContext.js`
2. `AUTHENTICATION_REQUIRED = True` w `deps.py`

## Testowy użytkownik

W trybie testowym, frontend używa następującego testowego użytkownika:

```json
{
  "id": 1,
  "email": "test@example.com",
  "first_name": "Test",
  "last_name": "User",
  "department": "IT",
  "is_active": true,
  "is_superuser": true
}
```

Ten użytkownik ma uprawnienia administratora, co oznacza, że ma dostęp do wszystkich funkcji systemu.
