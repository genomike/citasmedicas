const Especialidad = require('../models/Especialidad');

// Obtener todas las especialidades
const getEspecialidades = async (req, res) => {
  try {
    const { activa, conMedicos } = req.query;
    
    let query = {};
    if (activa !== undefined) {
      query.activa = activa === 'true';
    }
    
    const especialidades = await Especialidad.find(query).sort({ nombre: 1 });
    
    // Filtrar especialidades que tienen médicos si se solicita
    let result = especialidades;
    if (conMedicos === 'true') {
      const Medico = require('../models/Medico');
      const especialidadesConMedicos = [];
      
      for (const especialidad of especialidades) {
        const medicoCount = await Medico.countDocuments({ 
          especialidades: especialidad._id,
          activo: true 
        });
        if (medicoCount > 0) {
          especialidadesConMedicos.push(especialidad);
        }
      }
      result = especialidadesConMedicos;
    }
    
    res.json({
      success: true,
      data: result,
      total: result.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener especialidades',
      error: error.message
    });
  }
};

// Obtener una especialidad por ID
const getEspecialidadById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const especialidad = await Especialidad.findById(id);
    
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
};

// Crear nueva especialidad
const createEspecialidad = async (req, res) => {
  try {
    const especialidadData = req.body;
    
    // Verificar si ya existe una especialidad con el mismo nombre
    const especialidadExistente = await Especialidad.findOne({ 
      nombre: new RegExp(`^${especialidadData.nombre}$`, 'i') 
    });
    
    if (especialidadExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una especialidad con ese nombre'
      });
    }
    
    const nuevaEspecialidad = new Especialidad(especialidadData);
    const especialidadGuardada = await nuevaEspecialidad.save();
    
    res.status(201).json({
      success: true,
      data: especialidadGuardada,
      message: 'Especialidad creada exitosamente'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear la especialidad',
      error: error.message
    });
  }
};

// Actualizar especialidad
const updateEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar si existe otra especialidad con el mismo nombre
    if (updateData.nombre) {
      const especialidadExistente = await Especialidad.findOne({ 
        nombre: new RegExp(`^${updateData.nombre}$`, 'i'),
        _id: { $ne: id }
      });
      
      if (especialidadExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una especialidad con ese nombre'
        });
      }
    }
    
    const especialidadActualizada = await Especialidad.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!especialidadActualizada) {
      return res.status(404).json({
        success: false,
        message: 'Especialidad no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: especialidadActualizada,
      message: 'Especialidad actualizada exitosamente'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar la especialidad',
      error: error.message
    });
  }
};

// Eliminar especialidad (soft delete)
const deleteEspecialidad = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay médicos asociados a esta especialidad
    const Medico = require('../models/Medico');
    const medicosAsociados = await Medico.countDocuments({ 
      especialidades: id,
      activo: true 
    });
    
    if (medicosAsociados > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la especialidad. Hay ${medicosAsociados} médico(s) asociado(s).`
      });
    }
    
    // Verificar si hay citas futuras con esta especialidad
    const Cita = require('../models/Cita');
    const citasFuturas = await Cita.countDocuments({
      especialidad: id,
      fechaCita: { $gte: new Date() },
      estado: { $in: ['PROGRAMADA', 'CONFIRMADA'] }
    });
    
    if (citasFuturas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar la especialidad. Hay ${citasFuturas} cita(s) futura(s) programada(s).`
      });
    }
    
    const especialidadEliminada = await Especialidad.findByIdAndUpdate(
      id,
      { activa: false },
      { new: true }
    );
    
    if (!especialidadEliminada) {
      return res.status(404).json({
        success: false,
        message: 'Especialidad no encontrada'
      });
    }
    
    res.json({
      success: true,
      data: especialidadEliminada,
      message: 'Especialidad desactivada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la especialidad',
      error: error.message
    });
  }
};

// Obtener horarios disponibles de una especialidad
const getHorariosDisponibles = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha } = req.query;
    
    const especialidad = await Especialidad.findById(id);
    
    if (!especialidad) {
      return res.status(404).json({
        success: false,
        message: 'Especialidad no encontrada'
      });
    }
    
    const fechaConsulta = fecha ? new Date(fecha) : new Date();
    const diaSemana = fechaConsulta.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
    const nombreDia = diasSemana[diaSemana];
    
    const horarioEspecialidad = especialidad.horarios.find(h => h.dia === nombreDia);
    
    if (!horarioEspecialidad || !horarioEspecialidad.activo) {
      return res.json({
        success: true,
        data: [],
        message: 'No hay horarios disponibles para este día'
      });
    }
    
    // Generar slots de tiempo basados en la duración típica
    const horariosDisponibles = [];
    const [horaInicio, minutoInicio] = horarioEspecialidad.horaInicio.split(':').map(Number);
    const [horaFin, minutoFin] = horarioEspecialidad.horaFin.split(':').map(Number);
    
    const inicioMinutos = horaInicio * 60 + minutoInicio;
    const finMinutos = horaFin * 60 + minutoFin;
    const duracionSlot = especialidad.duracionTipica || 30;
    
    for (let minutos = inicioMinutos; minutos < finMinutos; minutos += duracionSlot) {
      const horas = Math.floor(minutos / 60);
      const mins = minutos % 60;
      const horaFormateada = `${horas.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
      
      horariosDisponibles.push({
        hora: horaFormateada,
        disponible: true // Aquí se podría verificar con citas existentes
      });
    }
    
    res.json({
      success: true,
      data: horariosDisponibles,
      dia: nombreDia,
      fecha: fechaConsulta.toISOString().split('T')[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener horarios disponibles',
      error: error.message
    });
  }
};

// Buscar especialidades
const searchEspecialidades = async (req, res) => {
  try {
    const { q, categoria } = req.query;
    
    let query = { activa: true };
    
    if (q) {
      query.$or = [
        { nombre: new RegExp(q, 'i') },
        { descripcion: new RegExp(q, 'i') },
        { 'requisitos.preparacion': new RegExp(q, 'i') }
      ];
    }
    
    if (categoria) {
      query.categoria = categoria;
    }
    
    const especialidades = await Especialidad.find(query)
      .sort({ nombre: 1 })
      .limit(50);
    
    res.json({
      success: true,
      data: especialidades,
      total: especialidades.length,
      query: { q, categoria }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar especialidades',
      error: error.message
    });
  }
};

module.exports = {
  getEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  deleteEspecialidad,
  getHorariosDisponibles,
  searchEspecialidades
};
