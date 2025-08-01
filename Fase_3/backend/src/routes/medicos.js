const express = require('express');
const router = express.Router();

// @route   GET /api/medicos
// @desc    Obtener todos los médicos
// @access  Public
router.get('/', async (req, res) => {
    try {
        res.json({ message: 'Obtener médicos - Por implementar', data: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// @route   GET /api/medicos/:id
// @desc    Obtener médico por ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ message: `Obtener médico ${id} - Por implementar` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// @route   GET /api/medicos/:id/horarios
// @desc    Obtener horarios disponibles de un médico
// @access  Public
router.get('/:id/horarios', async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ message: `Obtener horarios del médico ${id} - Por implementar`, data: [] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;
