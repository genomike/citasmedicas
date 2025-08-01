const Cita = require('../models/Cita');
const Medico = require('../models/Medico');
const Paciente = require('../models/Paciente');
const Especialidad = require('../models/Especialidad');

// Obtener todas las citas
const getCitas = async (req, res) => {
  try {
    const { 
      fecha, 
      medico, 
      paciente, 
      especialidad, 
      estado,
      fecha_desde,
      fecha_hasta,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = {};
    
    // Filtros de fecha
    if (fecha) {
      const fechaConsulta = new Date(fecha);
      const inicioDia = new Date(fechaConsulta);
      inicioDia.setHours(0, 0, 0, 0);
      const finDia = new Date(fechaConsulta);
      finDia.setHours(23, 59, 59, 999);
      
      query.fechaCita = {
        $gte: inicioDia,
        $lte: finDia
      };
    } else if (fecha_desde || fecha_hasta) {
      query.fechaCita = {};
      if (fecha_desde) {
        query.fechaCita.$gte = new Date(fecha_desde);
      }
      if (fecha_hasta) {
        query.fechaCita.$lte = new Date(fecha_hasta);
      }
    }
    
    // Otros filtros
    if (medico) query.medico = medico;
    if (paciente) query.paciente = paciente;
    if (especialidad) query.especialidad = especialidad;
    if (estado) query.estado = estado;
    
    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const citas = await Cita.find(query)
      .populate('paciente', 'nombre apellido dni telefono email')
      .populate('medico', 'nombre apellido cmp especialidades')
      .populate('especialidad', 'nombre descripcion')
      .sort({ fechaCita: 1, horaCita: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Cita.countDocuments(query);
    
    res.json({
      success: true,
      data: citas,
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
      message: 'Error al obtener citas',
      error: error.message
    });
  }
};

// Obtener una cita por ID
const getCitaById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cita = await Cita.findById(id)
      .populate('paciente')
      .populate('medico')
      .populate('especialidad');
    
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
};

// Crear nueva cita
const createCita = async (req, res) => {
  try {
    const citaData = req.body;
    
    // Validar que el paciente existe
    const paciente = await Paciente.findById(citaData.paciente);
    if (!paciente) {
      return res.status(400).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    // Validar que el médico existe y está activo
    const medico = await Medico.findById(citaData.medico);
    if (!medico || !medico.activo) {
      return res.status(400).json({
        success: false,
        message: 'Médico no encontrado o inactivo'
      });
    }
    
    // Validar que la especialidad existe y está activa
    const especialidad = await Especialidad.findById(citaData.especialidad);
    if (!especialidad || !especialidad.activa) {
      return res.status(400).json({
        success: false,
        message: 'Especialidad no encontrada o inactiva'
      });
    }
    
    // Validar que el médico tiene la especialidad
    if (!medico.especialidades.includes(citaData.especialidad)) {
      return res.status(400).json({
        success: false,
        message: 'El médico no tiene la especialidad seleccionada'
      });
    }
    
    // Verificar disponibilidad del médico en la fecha y hora
    const fechaCita = new Date(citaData.fechaCita);
    if (!medico.estaDisponible(fechaCita)) {
      return res.status(400).json({
        success: false,
        message: 'El médico no está disponible en la fecha seleccionada'
      });
    }
    
    // Verificar que no haya conflicto de horarios
    const citaExistente = await Cita.findOne({
      medico: citaData.medico,
      fechaCita: fechaCita,
      horaCita: citaData.horaCita,
      estado: { $in: ['PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION'] }
    });
    
    if (citaExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cita programada en ese horario'
      });
    }
    
    // Calcular costos basados en la especialidad
    if (!citaData.costo) {
      citaData.costo = {
        consulta: especialidad.precio || 0,
        procedimientos: 0,
        total: especialidad.precio || 0
      };
    }
    
    // Configurar información del seguro si el paciente tiene
    if (paciente.seguro && paciente.seguro.activo && !citaData.seguro) {
      citaData.seguro = {
        cubre: true,
        copago: paciente.seguro.copago || 0
      };
    }
    
    const nuevaCita = new Cita(citaData);
    const citaGuardada = await nuevaCita.save();
    
    // Poblar los datos para la respuesta
    await citaGuardada.populate([
      { path: 'paciente', select: 'nombre apellido dni telefono' },
      { path: 'medico', select: 'nombre apellido cmp' },
      { path: 'especialidad', select: 'nombre descripcion' }
    ]);
    
    res.status(201).json({
      success: true,
      data: citaGuardada,
      message: 'Cita creada exitosamente'
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cita en ese horario para el médico seleccionado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al crear la cita',
      error: error.message
    });
  }
};

// Actualizar cita
const updateCita = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const citaActual = await Cita.findById(id);
    if (!citaActual) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    // Si se está cambiando la fecha/hora, verificar disponibilidad
    if (updateData.fechaCita || updateData.horaCita) {
      const nuevaFecha = updateData.fechaCita ? new Date(updateData.fechaCita) : citaActual.fechaCita;
      const nuevaHora = updateData.horaCita || citaActual.horaCita;
      const medicoId = updateData.medico || citaActual.medico;
      
      // Verificar conflictos (excluyendo la cita actual)
      const citaConflicto = await Cita.findOne({
        _id: { $ne: id },
        medico: medicoId,
        fechaCita: nuevaFecha,
        horaCita: nuevaHora,
        estado: { $in: ['PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION'] }
      });
      
      if (citaConflicto) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una cita programada en ese horario'
        });
      }
    }
    
    // Si se está cambiando el médico, validar especialidad
    if (updateData.medico) {
      const medico = await Medico.findById(updateData.medico);
      if (!medico || !medico.activo) {
        return res.status(400).json({
          success: false,
          message: 'Médico no encontrado o inactivo'
        });
      }
      
      const especialidadId = updateData.especialidad || citaActual.especialidad;
      if (!medico.especialidades.includes(especialidadId)) {
        return res.status(400).json({
          success: false,
          message: 'El médico no tiene la especialidad de la cita'
        });
      }
    }
    
    const citaActualizada = await Cita.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate([
      { path: 'paciente', select: 'nombre apellido dni telefono' },
      { path: 'medico', select: 'nombre apellido cmp' },
      { path: 'especialidad', select: 'nombre descripcion' }
    ]);
    
    res.json({
      success: true,
      data: citaActualizada,
      message: 'Cita actualizada exitosamente'
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
      message: 'Error al actualizar la cita',
      error: error.message
    });
  }
};

// Confirmar cita
const confirmarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    const cita = await Cita.findById(id);
    
    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    if (cita.estado !== 'PROGRAMADA') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden confirmar citas en estado PROGRAMADA'
      });
    }
    
    await cita.confirmar(motivo);
    
    res.json({
      success: true,
      data: cita,
      message: 'Cita confirmada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al confirmar la cita',
      error: error.message
    });
  }
};

// Cancelar cita
const cancelarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    
    const cita = await Cita.findById(id);
    
    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    if (!cita.sePuedeCancelar()) {
      return res.status(400).json({
        success: false,
        message: 'La cita no se puede cancelar (muy próxima o ya finalizada)'
      });
    }
    
    await cita.cancelar(motivo);
    
    res.json({
      success: true,
      data: cita,
      message: 'Cita cancelada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cancelar la cita',
      error: error.message
    });
  }
};

// Reprogramar cita
const reprogramarCita = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevaFecha, nuevaHora, motivo } = req.body;
    
    if (!nuevaFecha || !nuevaHora) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere nueva fecha y hora'
      });
    }
    
    const cita = await Cita.findById(id);
    
    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    if (!['PROGRAMADA', 'CONFIRMADA'].includes(cita.estado)) {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden reprogramar citas programadas o confirmadas'
      });
    }
    
    // Verificar disponibilidad en la nueva fecha/hora
    const citaConflicto = await Cita.findOne({
      _id: { $ne: id },
      medico: cita.medico,
      fechaCita: new Date(nuevaFecha),
      horaCita: nuevaHora,
      estado: { $in: ['PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION'] }
    });
    
    if (citaConflicto) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una cita programada en el nuevo horario'
      });
    }
    
    await cita.reprogramar(nuevaFecha, nuevaHora, motivo);
    
    res.json({
      success: true,
      data: cita,
      message: 'Cita reprogramada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al reprogramar la cita',
      error: error.message
    });
  }
};

// Eliminar cita
const deleteCita = async (req, res) => {
  try {
    const { id } = req.params;
    
    const cita = await Cita.findById(id);
    
    if (!cita) {
      return res.status(404).json({
        success: false,
        message: 'Cita no encontrada'
      });
    }
    
    // Solo permitir eliminar citas que no han sido atendidas
    if (cita.estado === 'ATENDIDA') {
      return res.status(400).json({
        success: false,
        message: 'No se pueden eliminar citas que ya han sido atendidas'
      });
    }
    
    await Cita.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Cita eliminada exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar la cita',
      error: error.message
    });
  }
};

// Obtener citas de hoy
const getCitasHoy = async (req, res) => {
  try {
    const { medico, estado } = req.query;
    
    let query = {};
    if (medico) query.medico = medico;
    if (estado) query.estado = estado;
    
    const citas = await Cita.findHoy()
      .populate('paciente', 'nombre apellido dni telefono')
      .populate('medico', 'nombre apellido')
      .populate('especialidad', 'nombre');
    
    // Aplicar filtros adicionales si es necesario
    let citasFiltradas = citas;
    if (Object.keys(query).length > 0) {
      citasFiltradas = citas.filter(cita => {
        if (query.medico && cita.medico._id.toString() !== query.medico) return false;
        if (query.estado && cita.estado !== query.estado) return false;
        return true;
      });
    }
    
    res.json({
      success: true,
      data: citasFiltradas,
      fecha: new Date().toISOString().split('T')[0],
      estadisticas: {
        total: citasFiltradas.length,
        programadas: citasFiltradas.filter(c => c.estado === 'PROGRAMADA').length,
        confirmadas: citasFiltradas.filter(c => c.estado === 'CONFIRMADA').length,
        enAtencion: citasFiltradas.filter(c => c.estado === 'EN_ATENCION').length,
        atendidas: citasFiltradas.filter(c => c.estado === 'ATENDIDA').length,
        canceladas: citasFiltradas.filter(c => c.estado === 'CANCELADA').length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas de hoy',
      error: error.message
    });
  }
};

// Buscar citas
const searchCitas = async (req, res) => {
  try {
    const { 
      q, 
      fecha_desde, 
      fecha_hasta,
      estado,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = {};
    
    // Búsqueda por texto en múltiples campos
    if (q) {
      // Buscar en nombres de paciente, médico, motivo, observaciones
      const searchRegex = new RegExp(q, 'i');
      
      // Para buscar en campos poblados, necesitamos usar aggregation
      const pipeline = [
        {
          $lookup: {
            from: 'pacientes',
            localField: 'paciente',
            foreignField: '_id',
            as: 'pacienteInfo'
          }
        },
        {
          $lookup: {
            from: 'medicos',
            localField: 'medico',
            foreignField: '_id',
            as: 'medicoInfo'
          }
        },
        {
          $match: {
            $or: [
              { motivoConsulta: searchRegex },
              { observaciones: searchRegex },
              { 'pacienteInfo.nombre': searchRegex },
              { 'pacienteInfo.apellido': searchRegex },
              { 'pacienteInfo.dni': searchRegex },
              { 'medicoInfo.nombre': searchRegex },
              { 'medicoInfo.apellido': searchRegex }
            ]
          }
        }
      ];
      
      // Agregar filtros de fecha si existen
      if (fecha_desde || fecha_hasta) {
        const fechaFilter = {};
        if (fecha_desde) fechaFilter.$gte = new Date(fecha_desde);
        if (fecha_hasta) fechaFilter.$lte = new Date(fecha_hasta);
        pipeline.push({ $match: { fechaCita: fechaFilter } });
      }
      
      if (estado) {
        pipeline.push({ $match: { estado } });
      }
      
      // Paginación
      const skip = (parseInt(page) - 1) * parseInt(limit);
      pipeline.push({ $skip: skip });
      pipeline.push({ $limit: parseInt(limit) });
      pipeline.push({ $sort: { fechaCita: 1, horaCita: 1 } });
      
      const citas = await Cita.aggregate(pipeline);
      
      // Poblar manualmente los resultados
      await Cita.populate(citas, [
        { path: 'paciente', select: 'nombre apellido dni telefono' },
        { path: 'medico', select: 'nombre apellido cmp' },
        { path: 'especialidad', select: 'nombre descripcion' }
      ]);
      
      return res.json({
        success: true,
        data: citas,
        query: { q, fecha_desde, fecha_hasta, estado }
      });
    }
    
    // Búsqueda normal sin texto
    if (fecha_desde || fecha_hasta) {
      query.fechaCita = {};
      if (fecha_desde) query.fechaCita.$gte = new Date(fecha_desde);
      if (fecha_hasta) query.fechaCita.$lte = new Date(fecha_hasta);
    }
    
    if (estado) query.estado = estado;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const citas = await Cita.find(query)
      .populate('paciente', 'nombre apellido dni telefono')
      .populate('medico', 'nombre apellido cmp')
      .populate('especialidad', 'nombre descripcion')
      .sort({ fechaCita: 1, horaCita: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Cita.countDocuments(query);
    
    res.json({
      success: true,
      data: citas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: { fecha_desde, fecha_hasta, estado }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar citas',
      error: error.message
    });
  }
};

module.exports = {
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
};
