import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Container, AppBar, Toolbar, Typography, Box, BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { LocalHospital, CalendarToday, People, BarChart, Home } from '@mui/icons-material';

// Páginas
import HomePage from './pages/Home';
import CitasPage from './pages/CitasPage';
import MedicosPage from './pages/MedicosPage';
import EstadisticasPage from './pages/EstadisticasPage';

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

// Componente de navegación inferior
const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    switch (location.pathname) {
      case '/':
        setValue(0);
        break;
      case '/citas':
        setValue(1);
        break;
      case '/medicos':
        setValue(2);
        break;
      case '/estadisticas':
        setValue(3);
        break;
      default:
        setValue(0);
    }
  }, [location.pathname]);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Inicio"
          icon={<Home />}
          onClick={() => window.location.href = '/'}
        />
        <BottomNavigationAction
          label="Citas"
          icon={<CalendarToday />}
          onClick={() => window.location.href = '/citas'}
        />
        <BottomNavigationAction
          label="Médicos"
          icon={<People />}
          onClick={() => window.location.href = '/medicos'}
        />
        <BottomNavigationAction
          label="Panel"
          icon={<BarChart />}
          onClick={() => window.location.href = '/estadisticas'}
        />
      </BottomNavigation>
    </Paper>
  );
};

function App() {
  React.useEffect(() => {
    // Registrar Service Worker para PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registrado con éxito: ', registration);
          })
          .catch((registrationError) => {
            console.log('Error al registrar SW: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar position="static" elevation={2}>
            <Toolbar>
              <LocalHospital sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Hospital Regional del Cusco
              </Typography>
            </Toolbar>
          </AppBar>
          
          <Container maxWidth="lg" sx={{ flex: 1, mb: 8 }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/citas" element={<CitasPage />} />
              <Route path="/medicos" element={<MedicosPage />} />
              <Route path="/estadisticas" element={<EstadisticasPage />} />
            </Routes>
          </Container>
          
          <BottomNavBar />
          
          <Box component="footer" sx={{ py: 2, px: 2, backgroundColor: 'grey.100', textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              © 2024 Hospital Regional del Cusco. Sistema PWA de Gestión de Citas Médicas.
            </Typography>
          </Box>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
