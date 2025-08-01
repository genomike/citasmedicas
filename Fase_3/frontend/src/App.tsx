import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { LocalHospital } from '@mui/icons-material';

// Páginas (temporales para desarrollo)
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

// Tema personalizado para el hospital
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul médico
    },
    secondary: {
      main: '#dc004e', // Rojo de emergencia
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <AppBar position="static" elevation={2}>
            <Toolbar>
              <LocalHospital sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Hospital Regional del Cusco - Sistema de Citas
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Container>
          
          <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: 'grey.100' }}>
            <Container maxWidth="lg">
              <Typography variant="body2" color="text.secondary" align="center">
                © 2024 Hospital Regional del Cusco. Sistema de Gestión de Citas Médicas.
              </Typography>
            </Container>
          </Box>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
