require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 5001;

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas básicas (sin archivos externos por ahora)
// Especialidades
app.get('/api/especialidades', (req, res) => {
    const especialidades = [
        { id: 1, nombre: 'Medicina General', descripcion: 'Atención médica general' },
        { id: 2, nombre: 'Cardiología', descripcion: 'Especialista en corazón' },
        { id: 3, nombre: 'Pediatría', descripcion: 'Atención médica para niños' },
        { id: 4, nombre: 'Ginecología', descripcion: 'Salud femenina' },
        { id: 5, nombre: 'Traumatología', descripcion: 'Huesos y articulaciones' }
    ];
    
    res.json({ 
        message: 'Especialidades obtenidas correctamente', 
        data: especialidades 
    });
});

// Auth básico
app.post('/api/auth/login', (req, res) => {
    res.json({ message: 'Login endpoint - Por implementar' });
});

app.post('/api/auth/register', (req, res) => {
    res.json({ message: 'Register endpoint - Por implementar' });
});

// Citas básico
app.get('/api/citas', (req, res) => {
    res.json({ message: 'Obtener citas - Por implementar', data: [] });
});

app.post('/api/citas', (req, res) => {
    res.json({ message: 'Crear cita - Por implementar' });
});

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ 
        message: 'API del Sistema de Gestión de Citas Médicas funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🏥 API de Gestión de Citas Médicas - Hospital Regional del Cusco`);
    console.log(`📡 Endpoint de salud: http://localhost:${PORT}/api/health`);
});

module.exports = app;
