const Paciente = require('../models/Paciente');

// Obtener todos los pacientes
const getPacientes = async (req, res) => {
  try {
    const { 
      activo, 
      seguro,
      edad_min,
      edad_max,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = {};
    
    // Filtros
    if (activo !== undefined) {
      query.activo = activo === 'true';
    }
    
    if (seguro) {
      query['seguro.tipo'] = seguro;
    }
    
    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let pacientes = await Paciente.find(query)
      .sort({ apellido: 1, nombre: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Filtrar por edad si se especifica
    if (edad_min || edad_max) {
      pacientes = pacientes.filter(paciente => {
        const edad = paciente.edad;
        if (edad_min && edad < parseInt(edad_min)) return false;
        if (edad_max && edad > parseInt(edad_max)) return false;
        return true;
      });
    }
    
    const total = await Paciente.countDocuments(query);
    
    res.json({
      success: true,
      data: pacientes,
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
      message: 'Error al obtener pacientes',
      error: error.message
    });
  }
};

// Obtener un paciente por ID
const getPacienteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const paciente = await Paciente.findById(id);
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: paciente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el paciente',
      error: error.message
    });
  }
};

// Obtener paciente por DNI
const getPacienteByDni = async (req, res) => {
  try {
    const { dni } = req.params;
    
    const paciente = await Paciente.findOne({ dni });
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: paciente
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el paciente',
      error: error.message
    });
  }
};

// Crear nuevo paciente
const createPaciente = async (req, res) => {
  try {
    const pacienteData = req.body;
    
    // Verificar si ya existe un paciente con el mismo DNI
    const pacienteExistente = await Paciente.findOne({ dni: pacienteData.dni });
    
    if (pacienteExistente) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un paciente con ese DNI'
      });
    }
    
    // Verificar email único si se proporciona
    if (pacienteData.email) {
      const emailExistente = await Paciente.findOne({ email: pacienteData.email });
      if (emailExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un paciente con ese email'
        });
      }
    }
    
    const nuevoPaciente = new Paciente(pacienteData);
    const pacienteGuardado = await nuevoPaciente.save();
    
    res.status(201).json({
      success: true,
      data: pacienteGuardado,
      message: 'Paciente creado exitosamente'
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
      message: 'Error al crear el paciente',
      error: error.message
    });
  }
};

// Actualizar paciente
const updatePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar si existe otro paciente con el mismo DNI
    if (updateData.dni) {
      const pacienteExistente = await Paciente.findOne({ 
        dni: updateData.dni,
        _id: { $ne: id }
      });
      
      if (pacienteExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un paciente con ese DNI'
        });
      }
    }
    
    // Verificar email único si se está actualizando
    if (updateData.email) {
      const emailExistente = await Paciente.findOne({ 
        email: updateData.email,
        _id: { $ne: id }
      });
      
      if (emailExistente) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un paciente con ese email'
        });
      }
    }
    
    const pacienteActualizado = await Paciente.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!pacienteActualizado) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: pacienteActualizado,
      message: 'Paciente actualizado exitosamente'
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
      message: 'Error al actualizar el paciente',
      error: error.message
    });
  }
};

// Eliminar paciente (soft delete)
const deletePaciente = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si hay citas futuras con este paciente
    const Cita = require('../models/Cita');
    const citasFuturas = await Cita.countDocuments({
      paciente: id,
      fechaCita: { $gte: new Date() },
      estado: { $in: ['PROGRAMADA', 'CONFIRMADA'] }
    });
    
    if (citasFuturas > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el paciente. Hay ${citasFuturas} cita(s) futura(s) programada(s).`
      });
    }
    
    const pacienteEliminado = await Paciente.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    );
    
    if (!pacienteEliminado) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    res.json({
      success: true,
      data: pacienteEliminado,
      message: 'Paciente desactivado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el paciente',
      error: error.message
    });
  }
};

// Obtener historial médico de un paciente
const getHistorialMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const { limite = 50 } = req.query;
    
    const paciente = await Paciente.findById(id);
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    // Obtener citas pasadas del paciente
    const Cita = require('../models/Cita');
    const historialCitas = await Cita.find({
      paciente: id,
      estado: 'ATENDIDA'
    })
    .populate('medico', 'nombre apellido especialidades')
    .populate('especialidad', 'nombre')
    .sort({ fechaCita: -1 })
    .limit(parseInt(limite));
    
    res.json({
      success: true,
      data: {
        paciente: {
          id: paciente._id,
          nombre: paciente.nombre,
          apellido: paciente.apellido,
          dni: paciente.dni,
          fechaNacimiento: paciente.fechaNacimiento,
          edad: paciente.edad
        },
        historialMedico: paciente.historialMedico,
        citasAnteriores: historialCitas,
        estadisticas: {
          totalCitas: historialCitas.length,
          ultimaCita: historialCitas.length > 0 ? historialCitas[0].fechaCita : null
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener el historial médico',
      error: error.message
    });
  }
};

// Obtener citas de un paciente
const getCitasPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, futuras, pasadas, limite = 20 } = req.query;
    
    const paciente = await Paciente.findById(id);
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    let query = { paciente: id };
    
    // Filtrar por estado
    if (estado) {
      query.estado = estado;
    }
    
    // Filtrar por fecha
    const ahora = new Date();
    if (futuras === 'true') {
      query.fechaCita = { $gte: ahora };
    } else if (pasadas === 'true') {
      query.fechaCita = { $lt: ahora };
    }
    
    const Cita = require('../models/Cita');
    const citas = await Cita.find(query)
      .populate('medico', 'nombre apellido')
      .populate('especialidad', 'nombre')
      .sort({ fechaCita: futuras === 'true' ? 1 : -1 })
      .limit(parseInt(limite));
    
    res.json({
      success: true,
      data: {
        paciente: {
          id: paciente._id,
          nombre: paciente.nombre,
          apellido: paciente.apellido
        },
        citas,
        estadisticas: {
          total: citas.length,
          programadas: citas.filter(c => c.estado === 'PROGRAMADA').length,
          confirmadas: citas.filter(c => c.estado === 'CONFIRMADA').length,
          atendidas: citas.filter(c => c.estado === 'ATENDIDA').length,
          canceladas: citas.filter(c => c.estado === 'CANCELADA').length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener las citas del paciente',
      error: error.message
    });
  }
};

// Buscar pacientes
const searchPacientes = async (req, res) => {
  try {
    const { 
      q, 
      dni, 
      email,
      telefono,
      page = 1, 
      limit = 20 
    } = req.query;
    
    let query = { activo: true };
    
    // Búsqueda por texto general
    if (q) {
      query.$or = [
        { nombre: new RegExp(q, 'i') },
        { apellido: new RegExp(q, 'i') },
        { dni: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
        { telefono: new RegExp(q, 'i') }
      ];
    }
    
    // Búsquedas específicas
    if (dni) {
      query.dni = new RegExp(dni, 'i');
    }
    
    if (email) {
      query.email = new RegExp(email, 'i');
    }
    
    if (telefono) {
      query.telefono = new RegExp(telefono, 'i');
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const pacientes = await Paciente.find(query)
      .sort({ apellido: 1, nombre: 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Paciente.countDocuments(query);
    
    res.json({
      success: true,
      data: pacientes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      },
      filters: { q, dni, email, telefono }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar pacientes',
      error: error.message
    });
  }
};

// Actualizar historial médico
const updateHistorialMedico = async (req, res) => {
  try {
    const { id } = req.params;
    const { historialMedico } = req.body;
    
    const paciente = await Paciente.findById(id);
    
    if (!paciente) {
      return res.status(404).json({
        success: false,
        message: 'Paciente no encontrado'
      });
    }
    
    // Agregar nueva entrada al historial
    if (historialMedico) {
      paciente.historialMedico = { ...paciente.historialMedico, ...historialMedico };
    }
    
    const pacienteActualizado = await paciente.save();
    
    res.json({
      success: true,
      data: pacienteActualizado,
      message: 'Historial médico actualizado exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el historial médico',
      error: error.message
    });
  }
};

module.exports = {
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
};
