const express = require('express');
const router = express.Router();
const {
  getPacientes,
  getPacienteById,
  getPacienteByDni,
  createPaciente,
  updatePaciente,
  deletePaciente,
  getHistorialMedico,
  getCitasPaciente,
  searchPacientes,
  updateHistorialMedico
} = require('../controllers/pacienteController');

// Rutas públicas (sin autenticación por ahora)

// GET /api/pacientes - Obtener todos los pacientes
router.get('/', getPacientes);

// GET /api/pacientes/search - Buscar pacientes
router.get('/search', searchPacientes);

// GET /api/pacientes/dni/:dni - Obtener paciente por DNI
router.get('/dni/:dni', getPacienteByDni);

// GET /api/pacientes/:id - Obtener paciente por ID
router.get('/:id', getPacienteById);

// GET /api/pacientes/:id/historial - Obtener historial médico del paciente
router.get('/:id/historial', getHistorialMedico);

// GET /api/pacientes/:id/citas - Obtener citas del paciente
router.get('/:id/citas', getCitasPaciente);

// POST /api/pacientes - Crear nuevo paciente
router.post('/', createPaciente);

// PUT /api/pacientes/:id - Actualizar paciente
router.put('/:id', updatePaciente);

// PUT /api/pacientes/:id/historial - Actualizar historial médico
router.put('/:id/historial', updateHistorialMedico);

// DELETE /api/pacientes/:id - Eliminar paciente (soft delete)
router.delete('/:id', deletePaciente);

module.exports = router;
