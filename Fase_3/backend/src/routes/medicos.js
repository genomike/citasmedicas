const express = require('express');
const router = express.Router();
const {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico,
  getAgendaMedico,
  getDisponibilidadMedico,
  searchMedicos
} = require('../controllers/medicoController');

// Rutas públicas (sin autenticación por ahora)

// GET /api/medicos - Obtener todos los médicos
router.get('/', getMedicos);

// GET /api/medicos/search - Buscar médicos
router.get('/search', searchMedicos);

// GET /api/medicos/:id - Obtener médico por ID
router.get('/:id', getMedicoById);

// GET /api/medicos/:id/agenda - Obtener agenda del médico
router.get('/:id/agenda', getAgendaMedico);

// GET /api/medicos/:id/disponibilidad - Obtener disponibilidad del médico
router.get('/:id/disponibilidad', getDisponibilidadMedico);

// POST /api/medicos - Crear nuevo médico
router.post('/', createMedico);

// PUT /api/medicos/:id - Actualizar médico
router.put('/:id', updateMedico);

// DELETE /api/medicos/:id - Eliminar médico (soft delete)
router.delete('/:id', deleteMedico);

module.exports = router;
