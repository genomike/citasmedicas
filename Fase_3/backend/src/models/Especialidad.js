const mongoose = require('mongoose');

const especialidadSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la especialidad es obligatorio'],
    unique: true,
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres'],
    index: true
  },
  descripcion: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'El código es obligatorio'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z]{3,6}$/, 'El código debe tener entre 3 y 6 letras mayúsculas'],
    index: true
  },
  duracionConsultaMinutos: {
    type: Number,
    required: [true, 'La duración de consulta es obligatoria'],
    min: [15, 'La consulta mínima es 15 minutos'],
    max: [120, 'La consulta máxima es 120 minutos'],
    default: 30
  },
  precio: {
    type: Number,
    required: [true, 'El precio es obligatorio'],
    min: [0, 'El precio no puede ser negativo'],
    default: 0
  },
  requierePreparacion: {
    type: Boolean,
    default: false
  },
  instruccionesPreparacion: {
    type: String,
    trim: true,
    maxlength: [1000, 'Las instrucciones no pueden exceder 1000 caracteres']
  },
  equipoNecesario: [{
    type: String,
    trim: true
  }],
  horarioAtencion: {
    lunes: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' }
    },
    martes: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' }
    },
    miercoles: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' }
    },
    jueves: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' }
    },
    viernes: {
      activo: { type: Boolean, default: true },
      inicio: { type: String, default: '08:00' },
      fin: { type: String, default: '17:00' }
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
  activo: {
    type: Boolean,
    default: true
  },
  prioridad: {
    type: Number,
    default: 1,
    min: 1,
    max: 10
  }
}, {
  timestamps: true,
  collection: 'especialidades'
});

// Índices para optimización
especialidadSchema.index({ nombre: 1, activo: 1 });
especialidadSchema.index({ precio: 1 });
especialidadSchema.index({ prioridad: -1 });

// Virtual para contar médicos de esta especialidad
especialidadSchema.virtual('numeroMedicos', {
  ref: 'Medico',
  localField: '_id',
  foreignField: 'especialidades',
  count: true
});

// Virtual para contar citas de esta especialidad
especialidadSchema.virtual('numeroCitas', {
  ref: 'Cita',
  localField: '_id',
  foreignField: 'especialidad',
  count: true
});

// Middleware pre-save para formatear datos
especialidadSchema.pre('save', function(next) {
  // Capitalizar nombre
  this.nombre = this.nombre.charAt(0).toUpperCase() + this.nombre.slice(1).toLowerCase();
  
  // Si requiere preparación pero no hay instrucciones, agregar mensaje por defecto
  if (this.requierePreparacion && !this.instruccionesPreparacion) {
    this.instruccionesPreparacion = 'Consultar con el médico sobre preparación específica.';
  }
  
  next();
});

// Método estático para encontrar especialidades activas
especialidadSchema.statics.findActivas = function() {
  return this.find({ activo: true }).sort({ prioridad: -1, nombre: 1 });
};

// Método estático para buscar por código
especialidadSchema.statics.findByCodigo = function(codigo) {
  return this.findOne({ codigo: codigo.toUpperCase(), activo: true });
};

// Método de instancia para obtener médicos de esta especialidad
especialidadSchema.methods.getMedicos = async function() {
  const Medico = mongoose.model('Medico');
  return await Medico.find({ 
    especialidades: this._id, 
    activo: true 
  }).select('nombres apellidos colegioMedico');
};

// Método de instancia para verificar si está disponible en un día
especialidadSchema.methods.estaDisponible = function(dia) {
  const diasSemana = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const diaTexto = diasSemana[dia];
  return this.horarioAtencion[diaTexto] && this.horarioAtencion[diaTexto].activo;
};

// Asegurar que los virtuales se incluyan en JSON
especialidadSchema.set('toJSON', { virtuals: true });
especialidadSchema.set('toObject', { virtuals: true });

const Especialidad = mongoose.model('Especialidad', especialidadSchema);

module.exports = Especialidad;
