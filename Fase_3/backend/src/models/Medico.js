const mongoose = require('mongoose');

const medicoSchema = new mongoose.Schema({
  nombres: {
    type: String,
    required: [true, 'Los nombres son obligatorios'],
    trim: true,
    maxlength: [100, 'Los nombres no pueden exceder 100 caracteres']
  },
  apellidos: {
    type: String,
    required: [true, 'Los apellidos son obligatorios'],
    trim: true,
    maxlength: [100, 'Los apellidos no pueden exceder 100 caracteres']
  },
  dni: {
    type: String,
    required: [true, 'El DNI es obligatorio'],
    unique: true,
    match: [/^[0-9]{8}$/, 'El DNI debe tener 8 dígitos'],
    index: true
  },
  colegioMedico: {
    type: String,
    required: [true, 'El número de colegio médico es obligatorio'],
    unique: true,
    match: [/^[0-9]{4,6}$/, 'El colegio médico debe tener entre 4 y 6 dígitos'],
    index: true
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'El email no es válido'],
    index: true
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    match: [/^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos']
  },
  especialidades: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Especialidad',
    required: [true, 'Al menos una especialidad es obligatoria']
  }],
  fechaIngreso: {
    type: Date,
    required: [true, 'La fecha de ingreso es obligatoria'],
    default: Date.now
  },
  experienciaAnios: {
    type: Number,
    required: [true, 'Los años de experiencia son obligatorios'],
    min: [0, 'La experiencia no puede ser negativa'],
    max: [50, 'La experiencia no puede exceder 50 años']
  },
  universidadTitulo: {
    type: String,
    required: [true, 'La universidad donde obtuvo el título es obligatoria'],
    trim: true
  },
  residenciaMedica: {
    hospital: {
      type: String,
      trim: true
    },
    especialidad: {
      type: String,
      trim: true
    },
    anioInicio: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear()
    },
    anioFin: {
      type: Number,
      min: 1950,
      max: new Date().getFullYear()
    }
  },
  certificaciones: [{
    nombre: {
      type: String,
      required: true,
      trim: true
    },
    entidadEmisora: {
      type: String,
      required: true,
      trim: true
    },
    fechaEmision: {
      type: Date,
      required: true
    },
    fechaVencimiento: {
      type: Date
    },
    activa: {
      type: Boolean,
      default: true
    }
  }],
  horarioLaboral: {
    lunes: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' },
      descanso: {
        inicio: { type: String, default: '12:00' },
        fin: { type: String, default: '13:00' }
      }
    },
    martes: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' },
      descanso: {
        inicio: { type: String, default: '12:00' },
        fin: { type: String, default: '13:00' }
      }
    },
    miercoles: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' },
      descanso: {
        inicio: { type: String, default: '12:00' },
        fin: { type: String, default: '13:00' }
      }
    },
    jueves: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' },
      descanso: {
        inicio: { type: String, default: '12:00' },
        fin: { type: String, default: '13:00' }
      }
    },
    viernes: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' },
      descanso: {
        inicio: { type: String, default: '12:00' },
        fin: { type: String, default: '13:00' }
      }
    },
    sabado: {
      activo: { type: Boolean, default: false },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '12:00' }
    },
    domingo: {
      activo: { type: Boolean, default: false },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '12:00' }
    }
  },
  consultorio: {
    numero: {
      type: String,
      trim: true
    },
    piso: {
      type: String,
      trim: true
    },
    telefono: {
      type: String,
      match: [/^[0-9]{7,9}$/, 'El teléfono del consultorio debe tener entre 7 y 9 dígitos']
    }
  },
  tarifa: {
    consulta: {
      type: Number,
      required: [true, 'La tarifa de consulta es obligatoria'],
      min: [0, 'La tarifa no puede ser negativa'],
      default: 50
    },
    control: {
      type: Number,
      min: [0, 'La tarifa no puede ser negativa'],
      default: 30
    }
  },
  estado: {
    type: String,
    enum: ['ACTIVO', 'INACTIVO', 'VACACIONES', 'LICENCIA'],
    default: 'ACTIVO'
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'medicos'
});

// Índices compuestos para búsquedas optimizadas
medicoSchema.index({ nombres: 1, apellidos: 1 });
medicoSchema.index({ especialidades: 1, activo: 1 });
medicoSchema.index({ estado: 1, activo: 1 });
medicoSchema.index({ colegioMedico: 1 });

// Virtual para nombre completo
medicoSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombres} ${this.apellidos}`;
});

// Virtual para título profesional
medicoSchema.virtual('titulo').get(function() {
  return `Dr(a). ${this.nombreCompleto}`;
});

// Virtual para años desde ingreso
medicoSchema.virtual('aniosEnHospital').get(function() {
  const hoy = new Date();
  return hoy.getFullYear() - this.fechaIngreso.getFullYear();
});

// Asegurar que los virtuales se incluyan en JSON
medicoSchema.set('toJSON', { virtuals: true });
medicoSchema.set('toObject', { virtuals: true });

// Middleware pre-save para formatear datos
medicoSchema.pre('save', function(next) {
  // Capitalizar nombres y apellidos
  this.nombres = this.nombres.charAt(0).toUpperCase() + this.nombres.slice(1).toLowerCase();
  this.apellidos = this.apellidos.charAt(0).toUpperCase() + this.apellidos.slice(1).toLowerCase();
  
  next();
});

// Método estático para encontrar médicos activos
medicoSchema.statics.findActivos = function() {
  return this.find({ activo: true, estado: 'ACTIVO' })
    .populate('especialidades', 'nombre codigo')
    .sort({ apellidos: 1, nombres: 1 });
};

// Método estático para buscar por especialidad
medicoSchema.statics.findByEspecialidad = function(especialidadId) {
  return this.find({ 
    especialidades: especialidadId, 
    activo: true, 
    estado: 'ACTIVO' 
  }).populate('especialidades', 'nombre codigo');
};

// Método estático para buscar por colegio médico
medicoSchema.statics.findByColegioMedico = function(colegioMedico) {
  return this.findOne({ colegioMedico: colegioMedico, activo: true });
};

// Método de instancia para verificar disponibilidad en un día
medicoSchema.methods.estaDisponible = function(dia) {
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaTexto = diasSemana[dia];
  return this.horarioLaboral[diaTexto] && 
         this.horarioLaboral[diaTexto].activo && 
         this.estado === 'ACTIVO' && 
         this.activo;
};

// Método de instancia para obtener citas del médico
medicoSchema.methods.getCitas = async function(fechaInicio, fechaFin) {
  const Cita = mongoose.model('Cita');
  const query = { medico: this._id };
  
  if (fechaInicio && fechaFin) {
    query.fechaCita = {
      $gte: fechaInicio,
      $lte: fechaFin
    };
  }
  
  return await Cita.find(query)
    .populate('paciente', 'nombres apellidos dni telefono')
    .populate('especialidad', 'nombre codigo')
    .sort({ fechaCita: 1, horaCita: 1 });
};

// Método de instancia para verificar si tiene certificaciones vigentes
medicoSchema.methods.tieneCertificacionesVigentes = function() {
  const hoy = new Date();
  return this.certificaciones.some(cert => 
    cert.activa && 
    (!cert.fechaVencimiento || cert.fechaVencimiento > hoy)
  );
};

const Medico = mongoose.model('Medico', medicoSchema);

module.exports = Medico;
