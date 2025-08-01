const express = require('express');
const router = express.Router();
const {
  getEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
  getHorariosDisponibles,
  searchEspecialidades
} = require('../controllers/especialidadController');

// Rutas públicas (sin autenticación por ahora)

// GET /api/especialidades - Obtener todas las especialidades
router.get('/', getEspecialidades);

// GET /api/especialidades/search - Buscar especialidades
router.get('/search', searchEspecialidades);

// GET /api/especialidades/:id - Obtener especialidad por ID
router.get('/:id', getEspecialidadById);

// GET /api/especialidades/:id/horarios - Obtener horarios disponibles
router.get('/:id/horarios', getHorariosDisponibles);

// POST /api/especialidades - Crear nueva especialidad
router.post('/', createEspecialidad);

// PUT /api/especialidades/:id - Actualizar especialidad
router.put('/:id', updateEspecialidad);

// DELETE /api/especialidades/:id - Eliminar especialidad (soft delete)
router.delete('/:id', deleteEspecialidad);
module.exports = router;
