import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Container,
  Button,
  Chip,
  Stack
} from '@mui/material';
import {
  CalendarToday,
  Person,
  Schedule,
  Notifications
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  // Datos de ejemplo para desarrollo
  const proximasCitas = [
    {
      id: 1,
      fecha: '2024-08-15',
      hora: '10:00',
      medico: 'Dr. Carlos Mendoza',
      especialidad: 'Cardiología',
      estado: 'Confirmada'
    },
    {
      id: 2,
      fecha: '2024-08-20',
      hora: '15:30',
      medico: 'Dra. Ana García',
      especialidad: 'Medicina General',
      estado: 'Programada'
    }
  ];

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Confirmada': return 'success';
      case 'Programada': return 'warning';
      case 'Cancelada': return 'error';
      default: return 'default';
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Panel de Control
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Bienvenido de vuelta. Aquí puedes gestionar todas tus citas médicas.
          </Typography>
        </Box>

        {/* Actions */}
        <Box sx={{ mb: 4 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              variant="contained"
              startIcon={<CalendarToday />}
              size="large"
            >
              Nueva Cita
            </Button>
            <Button
              variant="outlined"
              startIcon={<Person />}
              size="large"
            >
              Mi Perfil
            </Button>
            <Button
              variant="outlined"
              startIcon={<Schedule />}
              size="large"
            >
              Historial
            </Button>
          </Stack>
        </Box>

        {/* Stats Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, gap: 3, mb: 4 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <CalendarToday color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" color="primary">
                {proximasCitas.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Próximas Citas
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Schedule color="success" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" color="success.main">
                12
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Citas Completadas
              </Typography>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Notifications color="warning" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" component="div" color="warning.main">
                1
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Recordatorios
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Próximas Citas */}
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Próximas Citas
            </Typography>
            
            {proximasCitas.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <CalendarToday sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                <Typography variant="body1" color="text.secondary">
                  No tienes citas programadas
                </Typography>
                <Button variant="contained" sx={{ mt: 2 }}>
                  Programar Nueva Cita
                </Button>
              </Box>
            ) : (
              <Box sx={{ mt: 2 }}>
                {proximasCitas.map((cita) => (
                  <Card key={cita.id} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="h6" component="div">
                            {cita.medico}
                          </Typography>
                          <Typography color="text.secondary" gutterBottom>
                            {cita.especialidad}
                          </Typography>
                        </Box>
                        <Chip
                          label={cita.estado}
                          color={getEstadoColor(cita.estado) as any}
                          size="small"
                        />
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <CalendarToday sx={{ mr: 1, fontSize: 18, color: 'text.secondary' }} />
                        <Typography variant="body2">
                          {formatearFecha(cita.fecha)} a las {cita.hora}
                        </Typography>
                      </Box>
                      
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined">
                          Reprogramar
                        </Button>
                        <Button size="small" color="error">
                          Cancelar
                        </Button>
                        <Button size="small" variant="contained">
                          Ver Detalles
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default Dashboard;
