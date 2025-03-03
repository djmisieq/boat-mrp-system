import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Products from './pages/Products';
import BOMs from './pages/BOMs';
import Orders from './pages/Orders';
import MaterialRequirements from './pages/MaterialRequirements';
import NotFound from './pages/NotFound';

// Components
import Layout from './components/Layout';
import RequireAuth from './components/RequireAuth';
import { useAuth } from './contexts/AuthContext';

// Create theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb', // Modern blue
      light: '#60a5fa',
      dark: '#1e40af',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#0ea5e9', // Sky blue
      light: '#7dd3fc',
      dark: '#0369a1',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#b91c1c',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#1d4ed8',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    background: {
      default: '#f9fafb',
      paper: '#ffffff',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      disabled: '#9ca3af',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.125rem',
      lineHeight: 1.5,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 500,
      textTransform: 'none', // Avoid all-caps buttons for modern look
    },
  },
  shape: {
    borderRadius: 8, // Slightly rounded corners
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.06), 0px 1px 3px rgba(0, 0, 0, 0.1)',
    '0px 1px 5px rgba(0, 0, 0, 0.05), 0px 1px 8px rgba(0, 0, 0, 0.05)',
    '0px 2px 4px rgba(0, 0, 0, 0.05), 0px 3px 6px rgba(0, 0, 0, 0.05)',
    '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 5px 8px rgba(0, 0, 0, 0.05)',
    '0px 5px 8px rgba(0, 0, 0, 0.04), 0px 6px 10px rgba(0, 0, 0, 0.04)',
    '0px 6px 10px rgba(0, 0, 0, 0.04), 0px 8px 12px rgba(0, 0, 0, 0.04)',
    '0px 7px 12px rgba(0, 0, 0, 0.04), 0px 9px 16px rgba(0, 0, 0, 0.04)',
    '0px 8px 14px rgba(0, 0, 0, 0.04), 0px 10px 18px rgba(0, 0, 0, 0.04)',
    '0px 9px 16px rgba(0, 0, 0, 0.04), 0px 12px 20px rgba(0, 0, 0, 0.04)',
    '0px 10px 18px rgba(0, 0, 0, 0.04), 0px 14px 22px rgba(0, 0, 0, 0.04)',
    '0px 11px 20px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04)',
    '0px 12px 22px rgba(0, 0, 0, 0.04), 0px 18px 28px rgba(0, 0, 0, 0.04)',
    '0px 13px 24px rgba(0, 0, 0, 0.04), 0px 20px 32px rgba(0, 0, 0, 0.04)',
    '0px 14px 26px rgba(0, 0, 0, 0.04), 0px 22px 36px rgba(0, 0, 0, 0.04)',
    '0px 15px 28px rgba(0, 0, 0, 0.04), 0px 24px 40px rgba(0, 0, 0, 0.04)',
    '0px 16px 30px rgba(0, 0, 0, 0.04), 0px 26px 44px rgba(0, 0, 0, 0.04)',
    '0px 17px 32px rgba(0, 0, 0, 0.04), 0px 28px 48px rgba(0, 0, 0, 0.04)',
    '0px 18px 34px rgba(0, 0, 0, 0.04), 0px 30px 52px rgba(0, 0, 0, 0.04)',
    '0px 19px 36px rgba(0, 0, 0, 0.04), 0px 32px 56px rgba(0, 0, 0, 0.04)',
    '0px 20px 38px rgba(0, 0, 0, 0.04), 0px 34px 60px rgba(0, 0, 0, 0.04)',
    '0px 21px 40px rgba(0, 0, 0, 0.04), 0px 36px 64px rgba(0, 0, 0, 0.04)',
    '0px 22px 42px rgba(0, 0, 0, 0.04), 0px 38px 68px rgba(0, 0, 0, 0.04)',
    '0px 23px 44px rgba(0, 0, 0, 0.04), 0px 40px 72px rgba(0, 0, 0, 0.04)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          },
        },
        sizeLarge: {
          padding: '10px 22px',
          fontSize: '1rem',
        },
        sizeSmall: {
          padding: '6px 12px',
          fontSize: '0.8125rem',
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#1d4ed8',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          overflow: 'hidden',
        },
      },
    },
    MuiCardHeader: {
      styleOverrides: {
        root: {
          padding: '16px 24px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
        title: {
          fontSize: '1.125rem',
          fontWeight: 600,
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '24px',
          '&:last-child': {
            paddingBottom: '24px',
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.02)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
        head: {
          fontWeight: 600,
          fontSize: '0.875rem',
          color: '#4b5563',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.01)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          border: 'none',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.05), 0px 5px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          padding: '8px 16px',
          '&.Mui-selected': {
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            '&:hover': {
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
            },
          },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          fontSize: '0.9375rem',
          fontWeight: 500,
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '40px',
          color: '#4b5563',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
        elevation1: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 16px',
        },
      },
    },
  },
});

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={
          isLoggedIn ? <Navigate to="/" /> : <Login />
        } />
        
        <Route element={<RequireAuth><Layout /></RequireAuth>}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/boms" element={<BOMs />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/material-requirements" element={<MaterialRequirements />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
