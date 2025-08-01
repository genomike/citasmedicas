// Simulación de base de datos en memoria para desarrollo sin MongoDB
let especialidades = [];
let medicos = [];
let pacientes = [];
let citas = [];
let nextId = 1;

// Datos de ejemplo
const especialidadesData = [
  {
    id: nextId++,
    nombre: 'Medicina General',
    descripcion: 'Atención médica general y de primera consulta',
    categoria: 'GENERAL',
    precio: 80,
    duracionTipica: 30,
    activa: true
  },
  {
    id: nextId++,
    nombre: 'Cardiología',
    descripcion: 'Especialidad dedicada al diagnóstico y tratamiento de enfermedades del corazón',
    categoria: 'ESPECIALIDAD',
    precio: 120,
    duracionTipica: 45,
    activa: true
  },
  {
    id: nextId++,
    nombre: 'Pediatría',
    descripcion: 'Atención médica especializada para niños y adolescentes',
    categoria: 'ESPECIALIDAD',
    precio: 90,
    duracionTipica: 30,
    activa: true
  },
  {
    id: nextId++,
    nombre: 'Ginecología',
    descripcion: 'Especialidad dedicada a la salud del aparato reproductor femenino',
    categoria: 'ESPECIALIDAD',
    precio: 100,
    duracionTipica: 40,
    activa: true
  },
  {
    id: nextId++,
    nombre: 'Traumatología',
    descripcion: 'Especialidad en diagnóstico y tratamiento de lesiones del sistema musculoesquelético',
    categoria: 'ESPECIALIDAD',
    precio: 110,
    duracionTipica: 35,
    activa: true
  }
];

const medicosData = [
  {
    id: nextId++,
    nombre: 'Dr. Carlos',
    apellido: 'Mendoza López',
    especialidad: 'Medicina General',
    especialidadId: 1,
    cmp: '12345',
    telefono: '984123456',
    email: 'carlos.mendoza@hospital.pe',
    activo: true
  },
  {
    id: nextId++,
    nombre: 'Dra. Ana María',
    apellido: 'Quispe Huamán',
    especialidad: 'Cardiología',
    especialidadId: 2,
    cmp: '23456',
    telefono: '984234567',
    email: 'ana.quispe@hospital.pe',
    activo: true
  },
  {
    id: nextId++,
    nombre: 'Dr. José Luis',
    apellido: 'Vargas Ccama',
    especialidad: 'Pediatría',
    especialidadId: 3,
    cmp: '34567',
    telefono: '984345678',
    email: 'jose.vargas@hospital.pe',
    activo: true
  }
];

const pacientesData = [
  {
    id: nextId++,
    nombre: 'María Elena',
    apellido: 'Gutierrez Rojas',
    dni: '45678901',
    fechaNacimiento: '1990-07-15',
    telefono: '984567890',
    email: 'maria.gutierrez@email.com',
    activo: true
  },
  {
    id: nextId++,
    nombre: 'Roberto',
    apellido: 'Mamani Condori',
    dni: '56789012',
    fechaNacimiento: '1985-12-03',
    telefono: '984678901',
    email: 'roberto.mamani@email.com',
    activo: true
  },
  {
    id: nextId++,
    nombre: 'Lucia',
    apellido: 'Flores Inca',
    dni: '67890123',
    fechaNacimiento: '2015-09-20',
    telefono: '984789012',
    activo: true
  }
];

const citasData = [
  {
    id: nextId++,
    pacienteId: 8,
    medicoId: 6,
    especialidadId: 1,
    fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hora: '09:00',
    estado: 'PROGRAMADA',
    motivo: 'Control de rutina y chequeo general',
    precio: 80
  },
  {
    id: nextId++,
    pacienteId: 9,
    medicoId: 7,
    especialidadId: 2,
    fecha: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hora: '14:30',
    estado: 'CONFIRMADA',
    motivo: 'Dolor en el pecho y palpitaciones',
    precio: 120
  },
  {
    id: nextId++,
    pacienteId: 10,
    medicoId: 8,
    especialidadId: 3,
    fecha: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hora: '10:00',
    estado: 'PROGRAMADA',
    motivo: 'Control de crecimiento y desarrollo',
    precio: 90
  }
];

// Inicializar datos
function initializeInMemoryDB() {
  especialidades = [...especialidadesData];
  medicos = [...medicosData];
  pacientes = [...pacientesData];
  citas = [...citasData];
  
  console.log('✅ Base de datos en memoria inicializada');
  console.log(`📊 Datos cargados: ${especialidades.length} especialidades, ${medicos.length} médicos, ${pacientes.length} pacientes, ${citas.length} citas`);
}

// Funciones para especialidades
const getEspecialidades = () => especialidades.filter(e => e.activa);
const getEspecialidadById = (id) => especialidades.find(e => e.id == id);
const createEspecialidad = (data) => {
  const nueva = { ...data, id: nextId++, activa: true };
  especialidades.push(nueva);
  return nueva;
};
const updateEspecialidad = (id, data) => {
  const index = especialidades.findIndex(e => e.id == id);
  if (index !== -1) {
    especialidades[index] = { ...especialidades[index], ...data };
    return especialidades[index];
  }
  return null;
};

// Funciones para médicos
const getMedicos = () => medicos.filter(m => m.activo);
const getMedicoById = (id) => medicos.find(m => m.id == id);
const getMedicosByEspecialidad = (especialidadId) => medicos.filter(m => m.especialidadId == especialidadId && m.activo);

// Funciones para pacientes
const getPacientes = () => pacientes.filter(p => p.activo);
const getPacienteById = (id) => pacientes.find(p => p.id == id);
const getPacienteByDni = (dni) => pacientes.find(p => p.dni === dni);
const createPaciente = (data) => {
  const nuevo = { ...data, id: nextId++, activo: true };
  pacientes.push(nuevo);
  return nuevo;
};

// Funciones para citas
const getCitas = () => {
  return citas.map(cita => {
    const paciente = getPacienteById(cita.pacienteId);
    const medico = getMedicoById(cita.medicoId);
    const especialidad = getEspecialidadById(cita.especialidadId);
    
    return {
      ...cita,
      paciente,
      medico,
      especialidad
    };
  });
};

const getCitaById = (id) => {
  const cita = citas.find(c => c.id == id);
  if (!cita) return null;
  
  const paciente = getPacienteById(cita.pacienteId);
  const medico = getMedicoById(cita.medicoId);
  const especialidad = getEspecialidadById(cita.especialidadId);
  
  return { ...cita, paciente, medico, especialidad };
};

const createCita = (data) => {
  const nueva = { 
    ...data, 
    id: nextId++,
    estado: 'PROGRAMADA'
  };
  citas.push(nueva);
  return getCitaById(nueva.id);
};

const updateCita = (id, data) => {
  const index = citas.findIndex(c => c.id == id);
  if (index !== -1) {
    citas[index] = { ...citas[index], ...data };
    return getCitaById(citas[index].id);
  }
  return null;
};

module.exports = {
  initializeInMemoryDB,
  getEspecialidades,
  getEspecialidadById,
  createEspecialidad,
  updateEspecialidad,
  getMedicos,
  getMedicoById,
  getMedicosByEspecialidad,
  getPacientes,
  getPacienteById,
  getPacienteByDni,
  createPaciente,
  getCitas,
  getCitaById,
  createCita,
  updateCita
};
