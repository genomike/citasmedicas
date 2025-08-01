import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Avatar,
  Box,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  LocalHospital,
  Schedule,
  Phone,
  Email
} from '@mui/icons-material';

interface Medico {
  id: number;
  nombre: string;
  especialidad: string;
  disponibilidad: string[];
  telefono: string;
  email: string;
  experiencia: string;
}

const MedicosPage: React.FC = () => {
  const [medicos] = useState<Medico[]>([
    {
      id: 1,
      nombre: 'Dr. Carlos Mendoza',
      especialidad: 'Cardiología',
      disponibilidad: ['Lunes 8:00-12:00', 'Miércoles 14:00-18:00', 'Viernes 8:00-12:00'],
      telefono: '+51 984 123 456',
      email: 'carlos.mendoza@hospitalcusco.pe',
      experiencia: '15 años'
    },
    {
      id: 2,
      nombre: 'Dra. Ana Rodríguez',
      especialidad: 'Pediatría',
      disponibilidad: ['Martes 8:00-12:00', 'Jueves 14:00-18:00', 'Sábado 8:00-12:00'],
      telefono: '+51 984 234 567',
      email: 'ana.rodriguez@hospitalcusco.pe',
      experiencia: '12 años'
    },
    {
      id: 3,
      nombre: 'Dr. Roberto Silva',
      especialidad: 'Neurología',
      disponibilidad: ['Lunes 14:00-18:00', 'Miércoles 8:00-12:00', 'Viernes 14:00-18:00'],
      telefono: '+51 984 345 678',
      email: 'roberto.silva@hospitalcusco.pe',
      experiencia: '20 años'
    },
    {
      id: 4,
      nombre: 'Dra. Isabel Cruz',
      especialidad: 'Ginecología',
      disponibilidad: ['Martes 14:00-18:00', 'Jueves 8:00-12:00', 'Sábado 14:00-18:00'],
      telefono: '+51 984 456 789',
      email: 'isabel.cruz@hospitalcusco.pe',
      experiencia: '18 años'
    },
    {
      id: 5,
      nombre: 'Dr. José Herrera',
      especialidad: 'Traumatología',
      disponibilidad: ['Lunes 8:00-12:00', 'Miércoles 14:00-18:00', 'Viernes 8:00-12:00'],
      telefono: '+51 984 567 890',
      email: 'jose.herrera@hospitalcusco.pe',
      experiencia: '10 años'
    },
    {
      id: 6,
      nombre: 'Dra. Rosa Huamán',
      especialidad: 'Medicina General',
      disponibilidad: ['Lunes a Viernes 8:00-16:00'],
      telefono: '+51 984 678 901',
      email: 'rosa.huaman@hospitalcusco.pe',
      experiencia: '8 años'
    }
  ]);

  const [filtroEspecialidad, setFiltroEspecialidad] = useState('');
  const [busqueda, setBusqueda] = useState('');

  const especialidades = ['Cardiología', 'Pediatría', 'Neurología', 'Ginecología', 'Traumatología', 'Medicina General'];

  const medicosFiltrados = medicos.filter(medico => {
    const coincideEspecialidad = !filtroEspecialidad || medico.especialidad === filtroEspecialidad;
    const coincideBusqueda = !busqueda || 
      medico.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      medico.especialidad.toLowerCase().includes(busqueda.toLowerCase());
    
    return coincideEspecialidad && coincideBusqueda;
  });

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getEspecialidadColor = (especialidad: string) => {
    const colors = {
      'Cardiología': '#f44336',
      'Pediatría': '#ff9800',
      'Neurología': '#9c27b0',
      'Ginecología': '#e91e63',
      'Traumatología': '#607d8b',
      'Medicina General': '#4caf50'
    };
    return colors[especialidad as keyof typeof colors] || '#1976d2';
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" color="primary" gutterBottom>
        Nuestros Médicos
      </Typography>

      {/* Filtros */}
      <Box display="flex" gap={2} mb={4} flexWrap="wrap">
        <TextField
          variant="outlined"
          placeholder="Buscar médico o especialidad..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{ minWidth: 300, flexGrow: 1 }}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Especialidad</InputLabel>
          <Select
            value={filtroEspecialidad}
            label="Especialidad"
            onChange={(e) => setFiltroEspecialidad(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {especialidades.map((esp) => (
              <MenuItem key={esp} value={esp}>{esp}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Lista de médicos */}
      <Stack spacing={2}>
        {medicosFiltrados.map((medico) => (
          <Card key={medico.id} elevation={3}>
            <CardContent>
              <Box display="flex" alignItems="flex-start" gap={3}>
                <Avatar
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: getEspecialidadColor(medico.especialidad),
                    fontSize: '1.5rem'
                  }}
                >
                  {getInitials(medico.nombre)}
                </Avatar>
                
                <Box flex={1}>
                  <Typography variant="h5" component="h2" gutterBottom>
                    {medico.nombre}
                  </Typography>
                  
                  <Chip
                    icon={<LocalHospital />}
                    label={medico.especialidad}
                    sx={{ 
                      mb: 2,
                      bgcolor: getEspecialidadColor(medico.especialidad),
                      color: 'white'
                    }}
                  />
                  
                  <Typography variant="body2" color="textSecondary" gutterBottom>
                    Experiencia: {medico.experiencia}
                  </Typography>

                  <Box mb={2}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                      Horarios de Atención:
                    </Typography>
                    {medico.disponibilidad.map((horario, index) => (
                      <Chip
                        key={index}
                        label={horario}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 1, mb: 1 }}
                      />
                    ))}
                  </Box>

                  <Box display="flex" gap={2} flexWrap="wrap">
                    <Box display="flex" alignItems="center" gap={1}>
                      <Phone fontSize="small" color="action" />
                      <Typography variant="body2">{medico.telefono}</Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Email fontSize="small" color="action" />
                      <Typography variant="body2">{medico.email}</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </CardContent>
            
            <CardActions>
              <Button 
                variant="contained" 
                color="primary"
                onClick={() => {
                  // Aquí podrías implementar la navegación a agendar cita
                  alert(`Agendar cita con ${medico.nombre}`);
                }}
              >
                Agendar Cita
              </Button>
              <Button 
                variant="outlined"
                onClick={() => {
                  // Aquí podrías mostrar más detalles del médico
                  alert(`Ver perfil de ${medico.nombre}`);
                }}
              >
                Ver Perfil
              </Button>
            </CardActions>
          </Card>
        ))}
      </Stack>

      {medicosFiltrados.length === 0 && (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No se encontraron médicos
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Intenta con diferentes criterios de búsqueda
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default MedicosPage;
