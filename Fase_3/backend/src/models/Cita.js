const mongoose = require('mongoose');

const citaSchema = new mongoose.Schema({
  paciente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Paciente',
    required: [true, 'El paciente es obligatorio'],
    index: true
  },
  medico: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medico',
    required: [true, 'El médico es obligatorio'],
    index: true
  },
  especialidad: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Especialidad',
    required: [true, 'La especialidad es obligatoria'],
    index: true
  },
  fechaCita: {
    type: Date,
    required: [true, 'La fecha de la cita es obligatoria'],
    index: true,
    validate: {
      validator: function(value) {
        // No permitir citas en el pasado (excepto el día actual)
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return value >= hoy;
      },
      message: 'No se pueden programar citas en el pasado'
    }
  },
  horaCita: {
    type: String,
    required: [true, 'La hora de la cita es obligatoria'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'El formato de hora debe ser HH:MM'],
    index: true
  },
  duracionMinutos: {
    type: Number,
    required: [true, 'La duración es obligatoria'],
    min: [15, 'La duración mínima es 15 minutos'],
    max: [120, 'La duración máxima es 120 minutos'],
    default: 30
  },
  tipoCita: {
    type: String,
    enum: ['CONSULTA', 'CONTROL', 'PROCEDIMIENTO', 'EMERGENCIA'],
    default: 'CONSULTA'
  },
  prioridad: {
    type: String,
    enum: ['BAJA', 'NORMAL', 'ALTA', 'URGENTE'],
    default: 'NORMAL'
  },
  estado: {
    type: String,
    enum: ['PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION', 'ATENDIDA', 'CANCELADA', 'NO_ASISTIO', 'REPROGRAMADA'],
    default: 'PROGRAMADA',
    index: true
  },
  motivoConsulta: {
    type: String,
    required: [true, 'El motivo de consulta es obligatorio'],
    trim: true,
    maxlength: [500, 'El motivo no puede exceder 500 caracteres']
  },
  observaciones: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las observaciones no pueden exceder 1000 caracteres']
  },
  sintomas: [{
    descripcion: {
      type: String,
      required: true,
      trim: true
    },
    intensidad: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    },
    duracion: {
      type: String,
      trim: true
    }
  }],
  consultorio: {
    numero: {
      type: String,
      trim: true
    },
    piso: {
      type: String,
      trim: true
    }
  },
  costo: {
    consulta: {
      type: Number,
      min: [0, 'El costo no puede ser negativo'],
      default: 0
    },
    procedimientos: {
      type: Number,
      min: [0, 'El costo no puede ser negativo'],
      default: 0
    },
    total: {
      type: Number,
      min: [0, 'El costo no puede ser negativo'],
      default: 0
    }
  },
  seguro: {
    cubre: {
      type: Boolean,
      default: false
    },
    copago: {
      type: Number,
      min: [0, 'El copago no puede ser negativo'],
      default: 0
    },
    autorizacion: {
      type: String,
      trim: true
    }
  },
  recordatorios: {
    sms: {
      enviado: { type: Boolean, default: false },
      fechaEnvio: { type: Date },
      telefono: { type: String }
    },
    email: {
      enviado: { type: Boolean, default: false },
      fechaEnvio: { type: Date },
      email: { type: String }
    },
    whatsapp: {
      enviado: { type: Boolean, default: false },
      fechaEnvio: { type: Date },
      telefono: { type: String }
    }
  },
  historialEstados: [{
    estado: {
      type: String,
      required: true
    },
    fecha: {
      type: Date,
      default: Date.now
    },
    motivo: {
      type: String,
      trim: true
    },
    usuario: {
      type: String,
      trim: true
    }
  }],
  fechaAtencion: {
    type: Date
  },
  resultados: {
    diagnostico: {
      type: String,
      trim: true
    },
    tratamiento: {
      type: String,
      trim: true
    },
    receta: [{
      medicamento: String,
      dosis: String,
      frecuencia: String,
      duracion: String
    }],
    proximaCita: {
      requerida: { type: Boolean, default: false },
      motivo: String,
      tiempoEstimado: String
    }
  }
}, {
  timestamps: true,
  collection: 'citas'
});

// Índices compuestos para búsquedas optimizadas
citaSchema.index({ fechaCita: 1, horaCita: 1 });
citaSchema.index({ medico: 1, fechaCita: 1, estado: 1 });
citaSchema.index({ paciente: 1, fechaCita: -1 });
citaSchema.index({ especialidad: 1, fechaCita: 1 });
citaSchema.index({ estado: 1, fechaCita: 1 });

// Índice único para evitar citas duplicadas en el mismo horario
citaSchema.index({ 
  medico: 1, 
  fechaCita: 1, 
  horaCita: 1 
}, { 
  unique: true,
  partialFilterExpression: { 
    estado: { $in: ['PROGRAMADA', 'CONFIRMADA', 'EN_ATENCION'] } 
  }
});

// Virtual para fecha y hora combinadas
citaSchema.virtual('fechaHoraCompleta').get(function() {
  const [horas, minutos] = this.horaCita.split(':');
  const fechaCompleta = new Date(this.fechaCita);
  fechaCompleta.setHours(parseInt(horas), parseInt(minutos), 0, 0);
  return fechaCompleta;
});

// Virtual para verificar si la cita es hoy
citaSchema.virtual('esHoy').get(function() {
  const hoy = new Date();
  const fechaCita = new Date(this.fechaCita);
  return hoy.toDateString() === fechaCita.toDateString();
});

// Virtual para verificar si la cita ya pasó
citaSchema.virtual('yaPaso').get(function() {
  const ahora = new Date();
  return this.fechaHoraCompleta < ahora;
});

// Virtual para tiempo restante hasta la cita
citaSchema.virtual('tiempoRestante').get(function() {
  const ahora = new Date();
  const diferencia = this.fechaHoraCompleta - ahora;
  
  if (diferencia <= 0) return 'Ya pasó';
  
  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
  
  if (dias > 0) return `${dias} días`;
  if (horas > 0) return `${horas} horas`;
  return `${minutos} minutos`;
});

// Asegurar que los virtuales se incluyan en JSON
citaSchema.set('toJSON', { virtuals: true });
citaSchema.set('toObject', { virtuals: true });

// Middleware pre-save para calcular costo total y agregar historial
citaSchema.pre('save', function(next) {
  // Calcular costo total
  this.costo.total = this.costo.consulta + this.costo.procedimientos - this.seguro.copago;
  
  // Agregar al historial si el estado cambió
  if (this.isModified('estado')) {
    this.historialEstados.push({
      estado: this.estado,
      fecha: new Date(),
      motivo: this.observaciones || 'Cambio de estado',
      usuario: 'Sistema'
    });
  }
  
  // Si se confirma la cita, establecer fecha de atención
  if (this.estado === 'ATENDIDA' && !this.fechaAtencion) {
    this.fechaAtencion = new Date();
  }
  
  next();
});

// Método estático para encontrar citas por fecha
citaSchema.statics.findByFecha = function(fecha) {
  const inicioDia = new Date(fecha);
  inicioDia.setHours(0, 0, 0, 0);
  
  const finDia = new Date(fecha);
  finDia.setHours(23, 59, 59, 999);
  
  return this.find({
    fechaCita: {
      $gte: inicioDia,
      $lte: finDia
    }
  }).populate('paciente medico especialidad');
};

// Método estático para encontrar citas de hoy
citaSchema.statics.findHoy = function() {
  return this.findByFecha(new Date());
};

// Método estático para encontrar próximas citas de un paciente
citaSchema.statics.findProximasPaciente = function(pacienteId) {
  return this.find({
    paciente: pacienteId,
    fechaCita: { $gte: new Date() },
    estado: { $in: ['PROGRAMADA', 'CONFIRMADA'] }
  }).populate('medico especialidad').sort({ fechaCita: 1, horaCita: 1 });
};

// Método estático para encontrar citas de un médico en un rango de fechas
citaSchema.statics.findByMedicoYRango = function(medicoId, fechaInicio, fechaFin) {
  return this.find({
    medico: medicoId,
    fechaCita: {
      $gte: fechaInicio,
      $lte: fechaFin
    }
  }).populate('paciente especialidad').sort({ fechaCita: 1, horaCita: 1 });
};

// Método de instancia para confirmar cita
citaSchema.methods.confirmar = function(motivo = 'Confirmada por el paciente') {
  this.estado = 'CONFIRMADA';
  this.observaciones = this.observaciones ? `${this.observaciones}. ${motivo}` : motivo;
  return this.save();
};

// Método de instancia para cancelar cita
citaSchema.methods.cancelar = function(motivo = 'Cancelada por el paciente') {
  this.estado = 'CANCELADA';
  this.observaciones = this.observaciones ? `${this.observaciones}. ${motivo}` : motivo;
  return this.save();
};

// Método de instancia para reprogramar cita
citaSchema.methods.reprogramar = function(nuevaFecha, nuevaHora, motivo = 'Reprogramada') {
  this.fechaCita = nuevaFecha;
  this.horaCita = nuevaHora;
  this.estado = 'REPROGRAMADA';
  this.observaciones = this.observaciones ? `${this.observaciones}. ${motivo}` : motivo;
  return this.save();
};

// Método de instancia para verificar si se puede cancelar
citaSchema.methods.sePuedeCancelar = function() {
  const ahora = new Date();
  const tiempoMinimoCancelacion = 2 * 60 * 60 * 1000; // 2 horas en millisegundos
  
  return this.fechaHoraCompleta - ahora > tiempoMinimoCancelacion &&
         ['PROGRAMADA', 'CONFIRMADA'].includes(this.estado);
};

const Cita = mongoose.model('Cita', citaSchema);

module.exports = Cita;
