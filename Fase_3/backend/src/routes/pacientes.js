const express = require('express');
const router = express.Router();

// @route   GET /api/pacientes
// @desc    Obtener todos los pacientes
// @access  Private (Admin/Personal)
router.get('/', async (req, res) => {
    try {
        res.json({ message: 'Obtener pacientes - Por implementar', data: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// @route   GET /api/pacientes/:id
// @desc    Obtener paciente por ID
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ message: `Obtener paciente ${id} - Por implementar` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// @route   PUT /api/pacientes/:id
// @desc    Actualizar datos del paciente
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ message: `Actualizar paciente ${id} - Por implementar` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
