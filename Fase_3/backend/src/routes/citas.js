const express = require('express');
const router = express.Router();
const {
  getCitas,
  getCitaById,
  createCita,
  updateCita,
  confirmarCita,
  cancelarCita,
  reprogramarCita,
  deleteCita,
  getCitasHoy,
  searchCitas
} = require('../controllers/citaController');

// Rutas públicas (sin autenticación por ahora)

// GET /api/citas - Obtener todas las citas
router.get('/', getCitas);

// GET /api/citas/hoy - Obtener citas de hoy
router.get('/hoy', getCitasHoy);

// GET /api/citas/search - Buscar citas
router.get('/search', searchCitas);

// GET /api/citas/:id - Obtener cita por ID
router.get('/:id', getCitaById);

// POST /api/citas - Crear nueva cita
router.post('/', createCita);

// PUT /api/citas/:id - Actualizar cita
router.put('/:id', updateCita);

// PUT /api/citas/:id/confirmar - Confirmar cita
router.put('/:id/confirmar', confirmarCita);

// PUT /api/citas/:id/cancelar - Cancelar cita
router.put('/:id/cancelar', cancelarCita);

// PUT /api/citas/:id/reprogramar - Reprogramar cita
router.put('/:id/reprogramar', reprogramarCita);

// DELETE /api/citas/:id - Eliminar cita
router.delete('/:id', deleteCita);

module.exports = router;
