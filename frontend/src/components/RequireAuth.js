import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RequireAuth = ({ children, requireAdmin = false }) => {
  const { isLoggedIn, currentUser, loading, testMode } = useAuth();

  // W trybie testowym zawsze renderuj zawartość, ponieważ uznajemy, że użytkownik jest zalogowany
  if (testMode) {
    return children;
  }

  if (loading) {
    return <div>Ładowanie...</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && !currentUser?.is_superuser) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default RequireAuth;
