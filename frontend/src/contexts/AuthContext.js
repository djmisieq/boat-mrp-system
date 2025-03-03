import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Flaga trybu testowego - ustaw na false w środowisku produkcyjnym
  const TEST_MODE = true;

  // Określenie bazowego URL API
  const API_BASE_URL = process.env.NODE_ENV === 'production' 
    ? '' // Pusty string użyje obecnego hosta w produkcji
    : 'http://localhost:8000'; // Lokalne środowisko dev

  // Sprawdzenie, czy token istnieje lub tryb testowy jest włączony
  useEffect(() => {
    if (TEST_MODE) {
      console.log("🔬 Tryb testowy: Automatyczne logowanie bez uwierzytelniania");
      // Symuluj zalogowanego użytkownika w trybie testowym
      setCurrentUser({
        id: 1,
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        department: 'IT',
        is_active: true,
        is_superuser: true
      });
      setIsLoggedIn(true);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('accessToken');
    
    if (token) {
      try {
        // Verify token is not expired
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;
        
        if (decodedToken.exp > currentTime) {
          // Set auth header for all requests
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          
          // Get user data
          fetchUserData();
        } else {
          // Token expired
          logout();
        }
      } catch (error) {
        // Invalid token
        logout();
      }
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/v1/users/me`);
      setCurrentUser(response.data);
      setIsLoggedIn(true);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  };

  const login = async (email, password) => {
    // W trybie testowym zawsze zwracaj sukces logowania
    if (TEST_MODE) {
      console.log("🔬 Tryb testowy: Automatyczne logowanie dla", {email, password});
      setCurrentUser({
        id: 1,
        email: email || 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        department: 'IT',
        is_active: true,
        is_superuser: true
      });
      setIsLoggedIn(true);
      toast.success('Zalogowano pomyślnie (tryb testowy)');
      return true;
    }

    try {
      console.log('Próba logowania:', {email, password});
      
      // Fast API expects form data for OAuth2 login
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      console.log('Wysyłanie żądania do:', `${API_BASE_URL}/api/v1/auth/login`);
      
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      console.log('Odpowiedź z serwera:', response.data);
      
      const { access_token } = response.data;
      
      localStorage.setItem('accessToken', access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      await fetchUserData();
      toast.success('Zalogowano pomyślnie');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Data:', error.response.data);
      }
      toast.error('Błąd logowania: Nieprawidłowy email lub hasło');
      return false;
    }
  };

  const logout = () => {
    if (TEST_MODE) {
      console.log("🔬 Tryb testowy: Wylogowanie (symulowane)");
      // W trybie testowym tylko symulujemy wylogowanie
      toast.info('Wylogowano (tryb testowy)');
      return;
    }

    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common['Authorization'];
    setCurrentUser(null);
    setIsLoggedIn(false);
    setLoading(false);
  };

  const value = {
    currentUser,
    isLoggedIn,
    login,
    logout,
    loading,
    testMode: TEST_MODE
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
