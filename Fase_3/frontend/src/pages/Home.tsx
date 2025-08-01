import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Container,
  Stack
} from '@mui/material';
import { 
  CalendarToday, 
  People, 
  LocalHospital, 
  AccessTime 
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CalendarToday color="primary" sx={{ fontSize: 40 }} />,
      title: 'Programar Citas',
      description: 'Reserva tu cita médica de forma rápida y sencilla, sin colas ni esperas.'
    },
    {
      icon: <People color="primary" sx={{ fontSize: 40 }} />,
      title: 'Buscar Especialistas',
      description: 'Encuentra el médico especialista que necesitas según tu condición.'
    },
    {
      icon: <AccessTime color="primary" sx={{ fontSize: 40 }} />,
      title: 'Horarios Flexibles',
      description: 'Consulta disponibilidad en tiempo real y elige el horario que mejor te convenga.'
    },
    {
      icon: <LocalHospital color="primary" sx={{ fontSize: 40 }} />,
      title: 'Atención de Calidad',
      description: 'Recibe atención médica de calidad en el Hospital Regional del Cusco.'
    }
  ];

  return (
    <Container maxWidth="lg">
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Sistema de Gestión de Citas Médicas
        </Typography>
        <Typography variant="h5" component="h2" color="text.secondary" paragraph>
          Hospital Regional del Cusco
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
          Modernizamos la forma de agendar tus citas médicas. Ahora puedes programar, 
          reprogramar y consultar tus citas desde la comodidad de tu hogar, 
          sin necesidad de hacer largas colas.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
          <Button 
            variant="contained" 
            size="large"
            onClick={() => navigate('/login')}
            sx={{ px: 4, py: 1.5 }}
          >
            Iniciar Sesión
          </Button>
          <Button 
            variant="outlined" 
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Registrarse
          </Button>
        </Stack>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" textAlign="center" gutterBottom>
          Beneficios del Sistema
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3, mt: 4 }}>
          {features.map((feature, index) => (
            <Card key={index} sx={{ height: '100%', textAlign: 'center', p: 2 }}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* CTA Section */}
      <Box sx={{ textAlign: 'center', py: 6, bgcolor: 'primary.main', color: 'white', borderRadius: 2, mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          ¿Listo para empezar?
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Únete a miles de pacientes que ya disfrutan de la comodidad de nuestro sistema digital.
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large"
          onClick={() => navigate('/login')}
        >
          Programar Mi Primera Cita
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
