const express = require('express');
const router = express.Router();

// @route   GET /api/especialidades
// @desc    Obtener todas las especialidades
// @access  Public
router.get('/', async (req, res) => {
    try {
        // Datos de ejemplo para desarrollo
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
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// @route   GET /api/especialidades/:id/medicos
// @desc    Obtener médicos por especialidad
// @access  Public
router.get('/:id/medicos', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ 
            message: `Obtener médicos de especialidad ${id} - Por implementar`, 
            data: [] 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
