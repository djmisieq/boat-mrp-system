"""
Skrypt testujący API logowania i pobierania danych użytkownika.
Służy do weryfikacji, czy backend poprawnie obsługuje żądania.
"""
import argparse
import sys
import requests
import json

def test_api(base_url, email, password):
    """Testuje API logowania i pobierania danych użytkownika."""
    # 1. Próba logowania
    login_url = f"{base_url}/api/v1/auth/login"
    login_data = {
        'username': email,
        'password': password
    }
    
    print(f"Próba logowania na {login_url} z danymi: {json.dumps(login_data, indent=2)}")
    
    try:
        login_response = requests.post(
            login_url, 
            data=login_data,
            headers={'Content-Type': 'application/x-www-form-urlencoded'}
        )
        
        print(f"Status odpowiedzi: {login_response.status_code}")
        print(f"Treść odpowiedzi: {json.dumps(login_response.json() if login_response.text else {}, indent=2)}")
        
        if login_response.status_code == 200:
            token = login_response.json().get('access_token')
            
            # 2. Próba pobrania danych użytkownika
            user_url = f"{base_url}/api/v1/users/me"
            user_response = requests.get(
                user_url,
                headers={'Authorization': f'Bearer {token}'}
            )
            
            print(f"\nPróba pobrania danych użytkownika z {user_url}")
            print(f"Status odpowiedzi: {user_response.status_code}")
            print(f"Treść odpowiedzi: {json.dumps(user_response.json() if user_response.text else {}, indent=2)}")
            
            return True
        else:
            print("Logowanie nie powiodło się")
            return False
    
    except Exception as e:
        print(f"Wystąpił błąd podczas testowania API: {e}")
        return False

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Test API logowania')
    parser.add_argument('--url', type=str, default='http://localhost:8000', help='Bazowy URL API')
    parser.add_argument('--email', type=str, default='admin@example.com', help='Email do logowania')
    parser.add_argument('--password', type=str, default='admin123', help='Hasło do logowania')
    
    args = parser.parse_args()
    
    success = test_api(args.url, args.email, args.password)
    sys.exit(0 if success else 1)
