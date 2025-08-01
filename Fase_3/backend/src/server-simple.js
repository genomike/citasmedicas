require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { 
  initializeInMemoryDB,
  getEspecialidades,
  getEspecialidadById,
  getMedicos,
  getMedicoById,
  getMedicosByEspecialidad,
  getPacientes,
  getPacienteById,
  getPacienteByDni,
  createPaciente,
  getCitas,
  getCitaById,
  createCita,
  updateCita
} = require('./database/memoryDB');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 5002;

// Inicializar base de datos en memoria
initializeInMemoryDB();

// Middlewares
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// === RUTAS DE ESPECIALIDADES ===
app.get('/api/especialidades', (req, res) => {
    try {
        const especialidades = getEspecialidades();
        res.json({
            success: true,
            data: especialidades,
            total: especialidades.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener especialidades',
            error: error.message
        });
    }
});

app.get('/api/especialidades/:id', (req, res) => {
    try {
        const { id } = req.params;
        const especialidad = getEspecialidadById(id);
        
        if (!especialidad) {
            return res.status(404).json({
                success: false,
                message: 'Especialidad no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: especialidad
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la especialidad',
            error: error.message
        });
    }
});

app.get('/api/especialidades/:id/medicos', (req, res) => {
    try {
        const { id } = req.params;
        const medicos = getMedicosByEspecialidad(id);
        
        res.json({
            success: true,
            data: medicos,
            total: medicos.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener médicos de la especialidad',
            error: error.message
        });
    }
});

// === RUTAS DE MÉDICOS ===
app.get('/api/medicos', (req, res) => {
    try {
        const { especialidad } = req.query;
        let medicos = getMedicos();
        
        if (especialidad) {
            medicos = getMedicosByEspecialidad(especialidad);
        }
        
        res.json({
            success: true,
            data: medicos,
            total: medicos.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener médicos',
            error: error.message
        });
    }
});

app.get('/api/medicos/:id', (req, res) => {
    try {
        const { id } = req.params;
        const medico = getMedicoById(id);
        
        if (!medico) {
            return res.status(404).json({
                success: false,
                message: 'Médico no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: medico
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el médico',
            error: error.message
        });
    }
});

// === RUTAS DE PACIENTES ===
app.get('/api/pacientes', (req, res) => {
    try {
        const pacientes = getPacientes();
        res.json({
            success: true,
            data: pacientes,
            total: pacientes.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener pacientes',
            error: error.message
        });
    }
});

app.get('/api/pacientes/:id', (req, res) => {
    try {
        const { id } = req.params;
        const paciente = getPacienteById(id);
        
        if (!paciente) {
            return res.status(404).json({
                success: false,
                message: 'Paciente no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: paciente
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el paciente',
            error: error.message
        });
    }
});

app.get('/api/pacientes/dni/:dni', (req, res) => {
    try {
        const { dni } = req.params;
        const paciente = getPacienteByDni(dni);
        
        if (!paciente) {
            return res.status(404).json({
                success: false,
                message: 'Paciente no encontrado'
            });
        }
        
        res.json({
            success: true,
            data: paciente
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener el paciente',
            error: error.message
        });
    }
});

app.post('/api/pacientes', (req, res) => {
    try {
        const pacienteData = req.body;
        
        // Validación básica
        if (!pacienteData.nombre || !pacienteData.apellido || !pacienteData.dni) {
            return res.status(400).json({
                success: false,
                message: 'Nombre, apellido y DNI son obligatorios'
            });
        }
        
        // Verificar DNI único
        const existente = getPacienteByDni(pacienteData.dni);
        if (existente) {
            return res.status(400).json({
                success: false,
                message: 'Ya existe un paciente con ese DNI'
            });
        }
        
        const nuevoPaciente = createPaciente(pacienteData);
        
        res.status(201).json({
            success: true,
            data: nuevoPaciente,
            message: 'Paciente creado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear el paciente',
            error: error.message
        });
    }
});

// === RUTAS DE CITAS ===
app.get('/api/citas', (req, res) => {
    try {
        const { fecha, medico, paciente, estado } = req.query;
        let citas = getCitas();
        
        // Filtros básicos
        if (fecha) {
            citas = citas.filter(c => c.fecha === fecha);
        }
        if (medico) {
            citas = citas.filter(c => c.medicoId == medico);
        }
        if (paciente) {
            citas = citas.filter(c => c.pacienteId == paciente);
        }
        if (estado) {
            citas = citas.filter(c => c.estado === estado);
        }
        
        res.json({
            success: true,
            data: citas,
            total: citas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener citas',
            error: error.message
        });
    }
});

app.get('/api/citas/hoy', (req, res) => {
    try {
        const hoy = new Date().toISOString().split('T')[0];
        const citas = getCitas().filter(c => c.fecha === hoy);
        
        res.json({
            success: true,
            data: citas,
            fecha: hoy,
            total: citas.length
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener las citas de hoy',
            error: error.message
        });
    }
});

app.get('/api/citas/:id', (req, res) => {
    try {
        const { id } = req.params;
        const cita = getCitaById(id);
        
        if (!cita) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: cita
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener la cita',
            error: error.message
        });
    }
});

app.post('/api/citas', (req, res) => {
    try {
        const citaData = req.body;
        
        // Validación básica
        if (!citaData.pacienteId || !citaData.medicoId || !citaData.especialidadId || !citaData.fecha || !citaData.hora) {
            return res.status(400).json({
                success: false,
                message: 'Todos los campos son obligatorios'
            });
        }
        
        // Verificar que existan los relacionados
        const paciente = getPacienteById(citaData.pacienteId);
        const medico = getMedicoById(citaData.medicoId);
        const especialidad = getEspecialidadById(citaData.especialidadId);
        
        if (!paciente || !medico || !especialidad) {
            return res.status(400).json({
                success: false,
                message: 'Paciente, médico o especialidad no válidos'
            });
        }
        
        const nuevaCita = createCita(citaData);
        
        res.status(201).json({
            success: true,
            data: nuevaCita,
            message: 'Cita creada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al crear la cita',
            error: error.message
        });
    }
});

app.put('/api/citas/:id/confirmar', (req, res) => {
    try {
        const { id } = req.params;
        const citaActualizada = updateCita(id, { estado: 'CONFIRMADA' });
        
        if (!citaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: citaActualizada,
            message: 'Cita confirmada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al confirmar la cita',
            error: error.message
        });
    }
});

app.put('/api/citas/:id/cancelar', (req, res) => {
    try {
        const { id } = req.params;
        const citaActualizada = updateCita(id, { estado: 'CANCELADA' });
        
        if (!citaActualizada) {
            return res.status(404).json({
                success: false,
                message: 'Cita no encontrada'
            });
        }
        
        res.json({
            success: true,
            data: citaActualizada,
            message: 'Cita cancelada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al cancelar la cita',
            error: error.message
        });
    }
});

// === RUTAS GENERALES ===
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        database: 'In-Memory (MongoDB no disponible)'
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'API Hospital Regional del Cusco - Sistema de Citas Médicas',
        version: '1.0.0',
        database: 'In-Memory',
        endpoints: {
            especialidades: '/api/especialidades',
            medicos: '/api/medicos',
            pacientes: '/api/pacientes',
            citas: '/api/citas',
            health: '/api/health'
        }
    });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error('❌ Error:', err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

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
    console.log(`📡 Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`💾 Base de datos: En memoria (MongoDB no disponible)`);
    console.log(`🌐 CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
});

module.exports = app;
