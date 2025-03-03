import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Error as ErrorIcon } from '@mui/icons-material';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9'
      }}
    >
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', py: 5 }}>
          <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 4 }} />
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h4" component="h2" gutterBottom>
            Strona nie została znaleziona
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Przepraszamy, strona której szukasz nie istnieje lub została przeniesiona.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 3 }}
          >
            Wróć do strony głównej
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
