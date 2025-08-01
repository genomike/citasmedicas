import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  FormControlLabel,
  Checkbox,
  Alert,
  Divider
} from '@mui/material';
import { LocalHospital, Login as LoginIcon } from '@mui/icons-material';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de autenticación
    setShowAlert(true);
    console.log('Datos de login:', formData);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%', maxWidth: 400 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <LocalHospital color="primary" sx={{ fontSize: 48, mb: 1 }} />
              <Typography component="h1" variant="h4" color="primary" fontWeight="bold">
                Iniciar Sesión
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mt: 1 }}>
                Hospital Regional del Cusco
              </Typography>
            </Box>

            {showAlert && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Funcionalidad en desarrollo. Los datos se muestran en consola.
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Correo Electrónico"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleInputChange}
                type="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Recordarme"
                sx={{ mt: 1 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Iniciar Sesión
              </Button>
              
              <Divider sx={{ my: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  o
                </Typography>
              </Divider>
              
              <Button
                fullWidth
                variant="outlined"
                sx={{ mb: 2 }}
              >
                Registrarse como Nuevo Paciente
              </Button>
              
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  ¿Olvidaste tu contraseña?{' '}
                  <Button variant="text" size="small">
                    Recuperar
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Datos de prueba:</strong><br />
            Email: paciente@hospital.com<br />
            Contraseña: 123456
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
