import React from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Alert,
  Chip,
  Stack
} from '@mui/material';
import {
  CalendarToday,
  People,
  LocalHospital,
  BarChart,
  Phone,
  LocationOn,
  Schedule,
  Emergency
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const servicios = [
    {
      icon: <CalendarToday fontSize="large" />,
      titulo: 'Gestionar Citas',
      descripcion: 'Programa, consulta y gestiona tus citas médicas de forma sencilla',
      ruta: '/citas',
      color: '#1976d2'
    },
    {
      icon: <People fontSize="large" />,
      titulo: 'Nuestros Médicos',
      descripcion: 'Conoce a nuestro equipo médico y sus especialidades',
      ruta: '/medicos',
      color: '#2e7d32'
    },
    {
      icon: <BarChart fontSize="large" />,
      titulo: 'Panel de Control',
      descripcion: 'Visualiza estadísticas y información del hospital',
      ruta: '/estadisticas',
      color: '#ed6c02'
    }
  ];

  const informacionHospital = {
    telefono: '+51 84-223366',
    direccion: 'Av. de la Cultura 1380, San Blas, Cusco',
    horarioAtencion: 'Lunes a Viernes: 7:00 AM - 7:00 PM',
    emergencias: '24 horas los 365 días del año'
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Bienvenida */}
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" color="primary" gutterBottom>
          Bienvenido al Sistema de Citas
        </Typography>
        <Typography variant="h5" color="textSecondary" gutterBottom>
          Hospital Regional del Cusco
        </Typography>
        <Typography variant="body1" color="textSecondary" paragraph>
          Gestiona tus citas médicas de manera fácil y rápida desde cualquier dispositivo
        </Typography>
      </Box>

      {/* Alerta PWA */}
      <Alert 
        severity="success" 
        sx={{ mb: 4 }}
        icon={<LocalHospital fontSize="inherit" />}
      >
        📱 <strong>Aplicación Web Progresiva (PWA)</strong> - Funciona sin conexión y se puede instalar en tu dispositivo
      </Alert>

      {/* Servicios principales */}
      <Typography variant="h4" component="h2" color="primary" gutterBottom sx={{ mb: 3 }}>
        Nuestros Servicios
      </Typography>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3} sx={{ mb: 5 }}>
        {servicios.map((servicio, index) => (
          <Card 
            key={index}
            elevation={3} 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 6
              }
            }}
          >
            <CardContent sx={{ flexGrow: 1 }}>
              <Box 
                display="flex" 
                alignItems="center" 
                justifyContent="center" 
                mb={2}
                sx={{ color: servicio.color }}
              >
                {servicio.icon}
              </Box>
              <Typography variant="h5" component="h3" gutterBottom textAlign="center">
                {servicio.titulo}
              </Typography>
              <Typography variant="body2" color="textSecondary" textAlign="center">
                {servicio.descripcion}
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                variant="contained" 
                size="large"
                onClick={() => navigate(servicio.ruta)}
                sx={{ backgroundColor: servicio.color }}
              >
                Acceder
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>

      {/* Información del hospital */}
      <Card elevation={3} sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" component="h2" color="primary" gutterBottom>
            Información del Hospital
          </Typography>
          
          <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3}>
            <Box>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Phone color="primary" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Teléfono Principal
                    </Typography>
                    <Typography variant="body2">
                      {informacionHospital.telefono}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <LocationOn color="primary" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Dirección
                    </Typography>
                    <Typography variant="body2">
                      {informacionHospital.direccion}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>

            <Box>
              <Stack spacing={2}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Schedule color="primary" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Horario de Atención
                    </Typography>
                    <Typography variant="body2">
                      {informacionHospital.horarioAtencion}
                    </Typography>
                  </Box>
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Emergency color="error" />
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" color="error">
                      Emergencias
                    </Typography>
                    <Typography variant="body2">
                      {informacionHospital.emergencias}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Especialidades destacadas */}
      <Box textAlign="center">
        <Typography variant="h5" component="h3" color="primary" gutterBottom>
          Especialidades Médicas Disponibles
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ mt: 2 }}>
          {['Cardiología', 'Pediatría', 'Neurología', 'Ginecología', 'Traumatología', 'Medicina General'].map((especialidad) => (
            <Chip 
              key={especialidad}
              label={especialidad}
              variant="outlined"
              color="primary"
              sx={{ m: 0.5 }}
            />
          ))}
        </Stack>
      </Box>
    </Container>
  );
};

export default Home;
