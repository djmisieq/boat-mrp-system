import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { TextField, Button, Paper, Typography, Box, Alert } from '@mui/material';

const Login = () => {
  const { login, isLoggedIn, testMode } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Nieprawidłowy email lub hasło');
      }
    } catch (error) {
      setError('Wystąpił błąd podczas logowania');
      console.error(error);
    }

    setLoading(false);
  };

  // Jeśli użytkownik jest już zalogowany, przekieruj go na dashboard
  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  // W trybie testowym, pokaż komunikat o trybie testowym i przycisk do automatycznego logowania
  if (testMode) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Logowanie (tryb testowy)
          </Typography>
          
          <Alert severity="info" sx={{ my: 2 }}>
            Aplikacja działa w trybie testowym. Logowanie jest symulowane.
          </Alert>
          
          <Box sx={{ mt: 2 }}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              onClick={() => {
                login('test@example.com', 'test123');
                navigate('/dashboard');
              }}
              disabled={loading}
            >
              Zaloguj się automatycznie
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Logowanie
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Adres email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Hasło"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
