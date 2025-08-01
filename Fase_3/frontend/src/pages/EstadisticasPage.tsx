import React from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Stack,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  EventAvailable,
  PendingActions,
  CancelPresentation,
  TrendingUp,
  LocalHospital,
  Schedule,
  Person,
  CalendarToday
} from '@mui/icons-material';

const EstadisticasPage: React.FC = () => {
  const estadisticas = {
    citasHoy: 45,
    citasSemana: 178,
    citasMes: 756,
    citasConfirmadas: 134,
    citasPendientes: 32,
    citasCanceladas: 12,
    especialidadMasSolicitada: 'Medicina General',
    medicoMasPopular: 'Dra. Rosa Huamán'
  };

  const citasProximas = [
    {
      id: 1,
      paciente: 'María González',
      medico: 'Dr. Carlos Mendoza',
      especialidad: 'Cardiología',
      fecha: '2024-08-01',
      hora: '09:00'
    },
    {
      id: 2,
      paciente: 'Luis Vargas',
      medico: 'Dra. Ana Rodríguez',
      especialidad: 'Pediatría',
      fecha: '2024-08-01',
      hora: '10:30'
    },
    {
      id: 3,
      paciente: 'Carmen Flores',
      medico: 'Dr. Roberto Silva',
      especialidad: 'Neurología',
      fecha: '2024-08-01',
      hora: '14:00'
    }
  ];

  const especialidadesPopulares = [
    { nombre: 'Medicina General', citas: 156, porcentaje: 42 },
    { nombre: 'Pediatría', citas: 89, porcentaje: 24 },
    { nombre: 'Cardiología', citas: 67, porcentaje: 18 },
    { nombre: 'Ginecología', citas: 45, porcentaje: 12 },
    { nombre: 'Neurología', citas: 23, porcentaje: 6 }
  ];

  const StatCard = ({ title, value, icon, color = 'primary' }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: string;
  }) => (
    <Card elevation={3} sx={{ height: '100%' }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="h4" component="div" color={color}>
              {value}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {title}
            </Typography>
          </Box>
          <Box color={color}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Panel de Control - Hospital Regional del Cusco
      </Typography>

      {/* Estadísticas principales */}
      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={2} mb={4}>
        <StatCard
          title="Citas Hoy"
          value={estadisticas.citasHoy}
          icon={<CalendarToday fontSize="large" />}
          color="primary"
        />
        <StatCard
          title="Citas Esta Semana"
          value={estadisticas.citasSemana}
          icon={<Schedule fontSize="large" />}
          color="secondary"
        />
        <StatCard
          title="Citas Este Mes"
          value={estadisticas.citasMes}
          icon={<TrendingUp fontSize="large" />}
          color="success"
        />
        <StatCard
          title="Total Médicos"
          value="24"
          icon={<LocalHospital fontSize="large" />}
          color="info"
        />
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={3}>
        {/* Estado de las citas */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Estado de las Citas
            </Typography>
            
            <Stack spacing={2}>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <EventAvailable color="success" />
                  <Typography>Confirmadas</Typography>
                </Box>
                <Chip label={estadisticas.citasConfirmadas} color="success" />
              </Box>
              
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <PendingActions color="warning" />
                  <Typography>Pendientes</Typography>
                </Box>
                <Chip label={estadisticas.citasPendientes} color="warning" />
              </Box>
              
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gap={1}>
                  <CancelPresentation color="error" />
                  <Typography>Canceladas</Typography>
                </Box>
                <Chip label={estadisticas.citasCanceladas} color="error" />
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Próximas citas */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Próximas Citas
            </Typography>
            
            <List dense>
              {citasProximas.map((cita, index) => (
                <React.Fragment key={cita.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Person color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={cita.paciente}
                      secondary={`${cita.medico} - ${cita.especialidad} - ${cita.hora}`}
                    />
                  </ListItem>
                  {index < citasProximas.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        </Card>

        {/* Especialidades más populares */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Especialidades Más Solicitadas
            </Typography>
            
            <Stack spacing={2}>
              {especialidadesPopulares.map((esp) => (
                <Box key={esp.nombre}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">{esp.nombre}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {esp.citas} citas
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={esp.porcentaje}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Información destacada */}
        <Card elevation={3}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="primary">
              Información Destacada
            </Typography>
            
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" color="secondary">
                  Especialidad Más Solicitada
                </Typography>
                <Typography variant="h6">
                  {estadisticas.especialidadMasSolicitada}
                </Typography>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" color="secondary">
                  Médico Más Popular
                </Typography>
                <Typography variant="h6">
                  {estadisticas.medicoMasPopular}
                </Typography>
              </Box>
              
              <Divider />
              
              <Box>
                <Typography variant="subtitle2" color="secondary">
                  Horario Más Demandado
                </Typography>
                <Typography variant="h6">
                  9:00 AM - 12:00 PM
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default EstadisticasPage;
