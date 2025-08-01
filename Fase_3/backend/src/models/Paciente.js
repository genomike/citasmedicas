const mongoose = require('mongoose');

const pacienteSchema = new mongoose.Schema({
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
  fechaNacimiento: {
    type: Date,
    required: [true, 'La fecha de nacimiento es obligatoria'],
    validate: {
      validator: function(value) {
        return value < new Date();
      },
      message: 'La fecha de nacimiento debe ser anterior a hoy'
    }
  },
  genero: {
    type: String,
    enum: ['M', 'F', 'Otro'],
    required: [true, 'El género es obligatorio']
  },
  telefono: {
    type: String,
    required: [true, 'El teléfono es obligatorio'],
    match: [/^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos']
  },
  email: {
    type: String,
    required: [true, 'El email es obligatorio'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'El email no es válido'],
    index: true
  },
  direccion: {
    calle: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true
    },
    distrito: {
      type: String,
      required: [true, 'El distrito es obligatorio'],
      trim: true
    },
    provincia: {
      type: String,
      default: 'Cusco',
      trim: true
    },
    departamento: {
      type: String,
      default: 'Cusco',
      trim: true
    }
  },
  contactoEmergencia: {
    nombre: {
      type: String,
      required: [true, 'El nombre del contacto de emergencia es obligatorio'],
      trim: true
    },
    telefono: {
      type: String,
      required: [true, 'El teléfono del contacto de emergencia es obligatorio'],
      match: [/^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos']
    },
    relacion: {
      type: String,
      required: [true, 'La relación con el contacto es obligatoria'],
      enum: ['Padre', 'Madre', 'Esposo/a', 'Hijo/a', 'Hermano/a', 'Otro']
    }
  },
  seguroMedico: {
    tipo: {
      type: String,
      enum: ['SIS', 'EsSalud', 'Privado', 'Ninguno'],
      default: 'Ninguno'
    },
    numero: {
      type: String,
      trim: true
    }
  },
  estadoCivil: {
    type: String,
    enum: ['Soltero/a', 'Casado/a', 'Divorciado/a', 'Viudo/a', 'Conviviente'],
    default: 'Soltero/a'
  },
  ocupacion: {
    type: String,
    trim: true
  },
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  collection: 'pacientes'
});

// Índices compuestos para búsquedas optimizadas
pacienteSchema.index({ nombres: 1, apellidos: 1 });
pacienteSchema.index({ 'direccion.distrito': 1 });
pacienteSchema.index({ fechaNacimiento: 1 });

// Virtual para nombre completo
pacienteSchema.virtual('nombreCompleto').get(function() {
  return `${this.nombres} ${this.apellidos}`;
});

// Virtual para edad
pacienteSchema.virtual('edad').get(function() {
  const hoy = new Date();
  const nacimiento = this.fechaNacimiento;
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mesActual = hoy.getMonth();
  const mesNacimiento = nacimiento.getMonth();
  
  if (mesActual < mesNacimiento || (mesActual === mesNacimiento && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }
  
  return edad;
});

// Asegurar que los virtuales se incluyan en JSON
pacienteSchema.set('toJSON', { virtuals: true });
pacienteSchema.set('toObject', { virtuals: true });

// Middleware pre-save para formatear datos
pacienteSchema.pre('save', function(next) {
  // Capitalizar nombres y apellidos
  this.nombres = this.nombres.charAt(0).toUpperCase() + this.nombres.slice(1).toLowerCase();
  this.apellidos = this.apellidos.charAt(0).toUpperCase() + this.apellidos.slice(1).toLowerCase();
  
  if (this.contactoEmergencia && this.contactoEmergencia.nombre) {
    this.contactoEmergencia.nombre = this.contactoEmergencia.nombre.charAt(0).toUpperCase() + 
                                     this.contactoEmergencia.nombre.slice(1).toLowerCase();
  }
  
  next();
});

// Método estático para buscar por DNI
pacienteSchema.statics.findByDNI = function(dni) {
  return this.findOne({ dni: dni, activo: true });
};

// Método de instancia para obtener historial de citas
pacienteSchema.methods.getHistorialCitas = async function() {
  const Cita = mongoose.model('Cita');
  return await Cita.find({ paciente: this._id }).populate('medico especialidad').sort({ fechaCita: -1 });
};

const Paciente = mongoose.model('Paciente', pacienteSchema);

module.exports = Paciente;
