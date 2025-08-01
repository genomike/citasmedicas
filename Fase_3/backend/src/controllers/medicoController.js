const Medico = require('../models/Medico');
const Especialidad = require('../models/Especialidad');

// Obtener todos los médicos
const getMedicos = async (req, res) => {
  try {
    const { 
      especialidad, 
      activo, 
      disponible, 
      fecha,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = {};
    
    // Filtros
    if (especialidad) {
      query.especialidades = especialidad;
    }
    
    if (activo !== undefined) {
      query.activo = activo === 'true';
    }
    
    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const medicos = await Medico.find(query)
      .populate('especialidades', 'nombre descripcion categoria')
      .sort({ nombre: 1, apellido: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Medico.countDocuments(query);
    
    // Filtrar por disponibilidad si se solicita
    let result = medicos;
    if (disponible === 'true' && fecha) {
      const fechaConsulta = new Date(fecha);
      result = medicos.filter(medico => medico.estaDisponible(fechaConsulta));
    }
    
    res.json({
      success: true,
      data: result,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener médicos',
      error: error.message
    });
  }
};

// Obtener un médico por ID
const getMedicoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const medico = await Medico.findById(id)
      .populate('especialidades', 'nombre descripcion categoria precio');
    
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
};

// Crear nuevo médico
const createMedico = async (req, res) => {
  try {
    const medicoData = req.body;
    
    // Verificar si ya existe un médico con el mismo CMP
    const medicoExistente = await Medico.findOne({ cmp: medicoData.cmp });
    
    if (medicoExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un médico con ese número de CMP'
      });
    }
    
    // Verificar que las especialidades existan
    if (medicoData.especialidades && medicoData.especialidades.length > 0) {
      const especialidadesValidas = await Especialidad.find({
        _id: { $in: medicoData.especialidades },
        activa: true
      });
      
      if (especialidadesValidas.length !== medicoData.especialidades.length) {
        return res.status(400).json({
          success: false,
          message: 'Una o más especialidades no son válidas'
        });
      }
    }
    
    const nuevoMedico = new Medico(medicoData);
    const medicoGuardado = await nuevoMedico.save();
    
    // Poblar especialidades para la respuesta
    await medicoGuardado.populate('especialidades', 'nombre descripcion');
    
    res.status(201).json({
      success: true,
      data: medicoGuardado,
      message: 'Médico creado exitosamente'
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
      message: 'Error al crear el médico',
      error: error.message
    });
  }
};

// Actualizar médico
const updateMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar si existe otro médico con el mismo CMP
    if (updateData.cmp) {
      const medicoExistente = await Medico.findOne({ 
        cmp: updateData.cmp,
        _id: { $ne: id }
      });
      
      if (medicoExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un médico con ese número de CMP'
        });
      }
    }
    
    // Verificar especialidades si se están actualizando
    if (updateData.especialidades && updateData.especialidades.length > 0) {
      const especialidadesValidas = await Especialidad.find({
        _id: { $in: updateData.especialidades },
        activa: true
      });
      
      if (especialidadesValidas.length !== updateData.especialidades.length) {
        return res.status(400).json({
          success: false,
          message: 'Una o más especialidades no son válidas'
        });
      }
    }
    
    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('especialidades', 'nombre descripcion');
    
    if (!medicoActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Médico no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: medicoActualizado,
      message: 'Médico actualizado exitosamente'
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
      message: 'Error al actualizar el médico',
      error: error.message
    });
  }
};

// Eliminar médico (soft delete)
const deleteMedico = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay citas futuras con este médico
    const Cita = require('../models/Cita');
    const citasFuturas = await Cita.countDocuments({
      medico: id,
      fechaCita: { $gte: new Date() },
      estado: { $in: ['PROGRAMADA', 'CONFIRMADA'] }
    });
    
    if (citasFuturas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el médico. Hay ${citasFuturas} cita(s) futura(s) programada(s).`
      });
    }
    
    const medicoEliminado = await Medico.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );
    
    if (!medicoEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Médico no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: medicoEliminado,
      message: 'Médico desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el médico',
      error: error.message
    });
  }
};

// Obtener agenda de un médico
const getAgendaMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, semana } = req.query;
    
    const medico = await Medico.findById(id);
    
    if (!medico) {
      return res.status(404).json({
        success: false,
        message: 'Médico no encontrado'
      });
    }
    
    let fechaInicio, fechaFin;
    
    if (semana) {
      // Obtener agenda de la semana
      const fechaBase = fecha ? new Date(fecha) : new Date();
      const diaSemana = fechaBase.getDay();
      fechaInicio = new Date(fechaBase);
      fechaInicio.setDate(fechaBase.getDate() - diaSemana);
      fechaInicio.setHours(0, 0, 0, 0);
      
      fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + 6);
      fechaFin.setHours(23, 59, 59, 999);
    } else {
      // Obtener agenda del día
      const fechaConsulta = fecha ? new Date(fecha) : new Date();
      fechaInicio = new Date(fechaConsulta);
      fechaInicio.setHours(0, 0, 0, 0);
      
      fechaFin = new Date(fechaConsulta);
      fechaFin.setHours(23, 59, 59, 999);
    }
    
    // Obtener citas del médico en el rango de fechas
    const Cita = require('../models/Cita');
    const citas = await Cita.find({
      medico: id,
      fechaCita: {
        $gte: fechaInicio,
        $lte: fechaFin
      }
    }).populate('paciente', 'nombre apellido telefono')
      .populate('especialidad', 'nombre')
      .sort({ fechaCita: 1, horaCita: 1 });
    
    // Generar horarios disponibles basados en la configuración del médico
    const horariosDisponibles = medico.getHorariosDisponibles(fechaInicio);
    
    res.json({
      success: true,
      data: {
        medico: {
          id: medico._id,
          nombre: medico.nombre,
          apellido: medico.apellido,
          especialidades: medico.especialidades
        },
        periodo: {
          inicio: fechaInicio,
          fin: fechaFin,
          tipo: semana ? 'semana' : 'dia'
        },
        citas,
        horariosDisponibles,
        estadisticas: {
          totalCitas: citas.length,
          citasConfirmadas: citas.filter(c => c.estado === 'CONFIRMADA').length,
          citasPendientes: citas.filter(c => c.estado === 'PROGRAMADA').length,
          citasCanceladas: citas.filter(c => c.estado === 'CANCELADA').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la agenda del médico',
      error: error.message
    });
  }
};

// Obtener disponibilidad de un médico
const getDisponibilidadMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, especialidad } = req.query;
    
    const medico = await Medico.findById(id);
    
    if (!medico) {
      return res.status(404).json({
        success: false,
        message: 'Médico no encontrado'
      });
    }
    
    const fechaConsulta = fecha ? new Date(fecha) : new Date();
    
    // Verificar si el médico está disponible en la fecha
    const disponible = medico.estaDisponible(fechaConsulta);
    
    if (!disponible) {
      return res.json({
        success: true,
        data: {
          disponible: false,
          motivo: 'El médico no tiene horarios configurados para este día',
          horarios: []
        }
      });
    }
    
    // Obtener horarios disponibles
    const horariosDisponibles = medico.getHorariosDisponibles(fechaConsulta);
    
    // Filtrar por especialidad si se especifica
    let horariosFiltered = horariosDisponibles;
    if (especialidad) {
      const especialidadObj = await Especialidad.findById(especialidad);
      if (especialidadObj) {
        // Aquí se podría implementar lógica específica por especialidad
        horariosFiltered = horariosDisponibles;
      }
    }
    
    res.json({
      success: true,
      data: {
        disponible: true,
        fecha: fechaConsulta.toISOString().split('T')[0],
        horarios: horariosFiltered,
        especialidades: medico.especialidades
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la disponibilidad del médico',
      error: error.message
    });
  }
};

// Buscar médicos
const searchMedicos = async (req, res) => {
  try {
    const { 
      q, 
      especialidad, 
      disponible, 
      fecha,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = { activo: true };
    
    // Búsqueda por texto
    if (q) {
      query.$or = [
        { nombre: new RegExp(q, 'i') },
        { apellido: new RegExp(q, 'i') },
        { cmp: new RegExp(q, 'i') },
        { 'contacto.email': new RegExp(q, 'i') }
      ];
    }
    
    // Filtrar por especialidad
    if (especialidad) {
      query.especialidades = especialidad;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let medicos = await Medico.find(query)
      .populate('especialidades', 'nombre descripcion categoria')
      .sort({ nombre: 1, apellido: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Filtrar por disponibilidad si se solicita
    if (disponible === 'true' && fecha) {
      const fechaConsulta = new Date(fecha);
      medicos = medicos.filter(medico => medico.estaDisponible(fechaConsulta));
    }
    
    const total = await Medico.countDocuments(query);
    
    res.json({
      success: true,
      data: medicos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: { q, especialidad, disponible, fecha }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar médicos',
      error: error.message
    });
  }
};

module.exports = {
  getMedicos,
  getMedicoById,
  createMedico,
  updateMedico,
  deleteMedico,
  getAgendaMedico,
  getDisponibilidadMedico,
  searchMedicos
};
