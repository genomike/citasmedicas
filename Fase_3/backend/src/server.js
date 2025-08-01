require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { connectDB } = require('./config/mongodb');

// Importar rutas
const especialidadesRoutes = require('./routes/especialidades');
const medicosRoutes = require('./routes/medicos');
const pacientesRoutes = require('./routes/pacientes');
const citasRoutes = require('./routes/citas');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 5001;

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging para desarrollo
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Rutas de la API
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/citas', citasRoutes);

// Ruta de salud del servidor
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'MongoDB Connected'
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({ 
        message: 'API Hospital Regional del Cusco - Sistema de Citas Médicas',
        version: '1.0.0',
        endpoints: {
            especialidades: '/api/especialidades',
            medicos: '/api/medicos',
            pacientes: '/api/pacientes',
            citas: '/api/citas',
            health: '/api/health'
        },
        database: 'MongoDB',
        documentation: 'Endpoints RESTful para gestión de citas médicas'
    });
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        message: 'Ruta no encontrada',
        path: req.originalUrl
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
    console.log(`🏥 API de Gestión de Citas Médicas - Hospital Regional del Cusco`);
    console.log(`📡 Endpoint de salud: http://localhost:${PORT}/api/health`);
    console.log(`🗄️  Base de datos: MongoDB`);
    console.log(`🌐 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
