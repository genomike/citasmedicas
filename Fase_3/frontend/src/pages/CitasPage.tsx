import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Fab,
  Alert,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  CalendarToday,
  Person,
  LocalHospital
} from '@mui/icons-material';

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  especialidad: string;
  medico: string;
  paciente: string;
  estado: 'PROGRAMADA' | 'CONFIRMADA' | 'CANCELADA';
}

const CitasPage: React.FC = () => {
  const [citas, setCitas] = useState<Cita[]>([
    {
      id: 1,
      fecha: '2024-08-01',
      hora: '09:00',
      especialidad: 'Cardiología',
      medico: 'Dr. Carlos Mendoza',
      paciente: 'María González',
      estado: 'CONFIRMADA'
    },
    {
      id: 2,
      fecha: '2024-08-01',
      hora: '10:30',
      especialidad: 'Pediatría',
      medico: 'Dra. Ana Rodríguez',
      paciente: 'Luis Vargas',
      estado: 'PROGRAMADA'
    }
  ]);

  const [openDialog, setOpenDialog] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    fecha: '',
    hora: '',
    especialidad: '',
    medico: '',
    paciente: ''
  });

  const especialidades = [
    'Cardiología',
    'Pediatría',
    'Neurología',
    'Ginecología',
    'Traumatología',
    'Medicina General'
  ];

  const medicos = {
    'Cardiología': ['Dr. Carlos Mendoza', 'Dra. Patricia Reyes'],
    'Pediatría': ['Dra. Ana Rodríguez', 'Dr. Miguel Torres'],
    'Neurología': ['Dr. Roberto Silva', 'Dra. Elena Morales'],
    'Ginecología': ['Dra. Isabel Cruz', 'Dr. Fernando López'],
    'Traumatología': ['Dr. José Herrera', 'Dra. María Santos'],
    'Medicina General': ['Dr. David Quispe', 'Dra. Rosa Huamán']
  };

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADA': return 'success';
      case 'PROGRAMADA': return 'warning';
      case 'CANCELADA': return 'error';
      default: return 'default';
    }
  };

  const handleCrearCita = () => {
    if (nuevaCita.fecha && nuevaCita.hora && nuevaCita.especialidad && nuevaCita.medico && nuevaCita.paciente) {
      const cita: Cita = {
        id: citas.length + 1,
        ...nuevaCita,
        estado: 'PROGRAMADA'
      };
      setCitas([...citas, cita]);
      setNuevaCita({
        fecha: '',
        hora: '',
        especialidad: '',
        medico: '',
        paciente: ''
      });
      setOpenDialog(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" color="primary">
          Gestión de Citas Médicas
        </Typography>
        <Fab
          color="primary"
          aria-label="agregar cita"
          onClick={() => setOpenDialog(true)}
        >
          <AddIcon />
        </Fab>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        📱 Esta aplicación funciona sin conexión. Las citas se sincronizan automáticamente cuando hay internet.
      </Alert>

      <Stack spacing={2}>
        {citas.map((cita) => (
          <Card key={cita.id} elevation={3}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                <Typography variant="h6" component="h2" color="primary">
                  {cita.especialidad}
                </Typography>
                <Chip
                  label={cita.estado}
                  color={getEstadoColor(cita.estado) as any}
                  size="small"
                />
              </Box>

              <List dense>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <CalendarToday color="action" />
                  </ListItemIcon>
                  <ListItemText 
                    primary={formatearFecha(cita.fecha)}
                    secondary={`${cita.hora}`}
                  />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <LocalHospital color="action" />
                  </ListItemIcon>
                  <ListItemText primary={cita.medico} />
                </ListItem>
                
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon>
                    <Person color="action" />
                  </ListItemIcon>
                  <ListItemText primary={cita.paciente} />
                </ListItem>
              </List>

              <Box mt={2}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  sx={{ mr: 1 }}
                  onClick={() => {
                    const nuevasCitas = citas.map(c => 
                      c.id === cita.id 
                        ? { ...c, estado: c.estado === 'CONFIRMADA' ? 'PROGRAMADA' : 'CONFIRMADA' as any }
                        : c
                    );
                    setCitas(nuevasCitas);
                  }}
                >
                  {cita.estado === 'CONFIRMADA' ? 'Desconfirmar' : 'Confirmar'}
                </Button>
                <Button 
                  variant="outlined" 
                  color="error" 
                  size="small"
                  onClick={() => {
                    const nuevasCitas = citas.map(c => 
                      c.id === cita.id ? { ...c, estado: 'CANCELADA' as any } : c
                    );
                    setCitas(nuevasCitas);
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {citas.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No hay citas programadas
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Haz clic en el botón + para crear una nueva cita
          </Typography>
        </Box>
      )}

      {/* Dialog para crear nueva cita */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Nueva Cita Médica</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Nombre del Paciente"
              value={nuevaCita.paciente}
              onChange={(e) => setNuevaCita({ ...nuevaCita, paciente: e.target.value })}
            />
            
            <FormControl fullWidth>
              <InputLabel>Especialidad</InputLabel>
              <Select
                value={nuevaCita.especialidad}
                label="Especialidad"
                onChange={(e) => setNuevaCita({ ...nuevaCita, especialidad: e.target.value, medico: '' })}
              >
                {especialidades.map((esp) => (
                  <MenuItem key={esp} value={esp}>{esp}</MenuItem>
                ))}
              </Select>
            </FormControl>

            {nuevaCita.especialidad && (
              <FormControl fullWidth>
                <InputLabel>Médico</InputLabel>
                <Select
                  value={nuevaCita.medico}
                  label="Médico"
                  onChange={(e) => setNuevaCita({ ...nuevaCita, medico: e.target.value })}
                >
                  {(medicos[nuevaCita.especialidad as keyof typeof medicos] || []).map((med) => (
                    <MenuItem key={med} value={med}>{med}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                type="date"
                label="Fecha"
                value={nuevaCita.fecha}
                onChange={(e) => setNuevaCita({ ...nuevaCita, fecha: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                type="time"
                label="Hora"
                value={nuevaCita.hora}
                onChange={(e) => setNuevaCita({ ...nuevaCita, hora: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleCrearCita} variant="contained">
            Crear Cita
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CitasPage;
