const mongoose = require('mongoose');
const { connectDB } = require('./config/mongodb');
const Especialidad = require('./models/Especialidad');
const Medico = require('./models/Medico');
const Paciente = require('./models/Paciente');
const Cita = require('./models/Cita');

// Datos de ejemplo para especialidades
const especialidadesData = [
  {
    nombre: 'Medicina General',
    descripcion: 'Atención médica general y de primera consulta',
    categoria: 'GENERAL',
    precio: 80,
    duracionTipica: 30,
    activa: true,
    horarios: [
      { dia: 'lunes', horaInicio: '08:00', horaFin: '12:00', activo: true },
      { dia: 'martes', horaInicio: '08:00', horaFin: '12:00', activo: true },
      { dia: 'miercoles', horaInicio: '08:00', horaFin: '12:00', activo: true },
      { dia: 'jueves', horaInicio: '08:00', horaFin: '12:00', activo: true },
      { dia: 'viernes', horaInicio: '08:00', horaFin: '12:00', activo: true }
    ],
    requisitos: {
      ayuno: false,
      preparacion: 'Traer documento de identidad y carnet de seguro'
    }
  },
  {
    nombre: 'Cardiología',
    descripcion: 'Especialidad dedicada al diagnóstico y tratamiento de enfermedades del corazón',
    categoria: 'ESPECIALIDAD',
    precio: 120,
    duracionTipica: 45,
    activa: true,
    horarios: [
      { dia: 'lunes', horaInicio: '14:00', horaFin: '18:00', activo: true },
      { dia: 'miercoles', horaInicio: '14:00', horaFin: '18:00', activo: true },
      { dia: 'viernes', horaInicio: '14:00', horaFin: '18:00', activo: true }
    ],
    requisitos: {
      ayuno: false,
      preparacion: 'Traer electrocardiogramas previos y lista de medicamentos actuales'
    }
  },
  {
    nombre: 'Pediatría',
    descripcion: 'Atención médica especializada para niños y adolescentes',
    categoria: 'ESPECIALIDAD',
    precio: 90,
    duracionTipica: 30,
    activa: true,
    horarios: [
      { dia: 'lunes', horaInicio: '08:00', horaFin: '16:00', activo: true },
      { dia: 'martes', horaInicio: '08:00', horaFin: '16:00', activo: true },
      { dia: 'miercoles', horaInicio: '08:00', horaFin: '16:00', activo: true },
      { dia: 'jueves', horaInicio: '08:00', horaFin: '16:00', activo: true },
      { dia: 'viernes', horaInicio: '08:00', horaFin: '12:00', activo: true }
    ],
    requisitos: {
      ayuno: false,
      preparacion: 'Traer carnet de vacunación y partida de nacimiento'
    }
  },
  {
    nombre: 'Ginecología',
    descripcion: 'Especialidad dedicada a la salud del aparato reproductor femenino',
    categoria: 'ESPECIALIDAD',
    precio: 100,
    duracionTipica: 40,
    activa: true,
    horarios: [
      { dia: 'lunes', horaInicio: '14:00', horaFin: '18:00', activo: true },
      { dia: 'martes', horaInicio: '14:00', horaFin: '18:00', activo: true },
      { dia: 'jueves', horaInicio: '14:00', horaFin: '18:00', activo: true },
      { dia: 'viernes', horaInicio: '14:00', horaFin: '18:00', activo: true }
    ],
    requisitos: {
      ayuno: false,
      preparacion: 'Higiene íntima previa. Traer fecha de última menstruación'
    }
  },
  {
    nombre: 'Traumatología',
    descripcion: 'Especialidad en diagnóstico y tratamiento de lesiones del sistema musculoesquelético',
    categoria: 'ESPECIALIDAD',
    precio: 110,
    duracionTipica: 35,
    activa: true,
    horarios: [
      { dia: 'lunes', horaInicio: '08:00', horaFin: '12:00', activo: true },
      { dia: 'miercoles', horaInicio: '08:00', horaFin: '12:00', activo: true },
      { dia: 'viernes', horaInicio: '08:00', horaFin: '12:00', activo: true }
    ],
    requisitos: {
      ayuno: false,
      preparacion: 'Traer radiografías previas y estudios relacionados'
    }
  },
  {
    nombre: 'Dermatología',
    descripcion: 'Especialidad dedicada al diagnóstico y tratamiento de enfermedades de la piel',
    categoria: 'ESPECIALIDAD',
    precio: 95,
    duracionTipica: 30,
    activa: true,
    horarios: [
      { dia: 'martes', horaInicio: '08:00', horaFin: '12:00', activo: true },
      { dia: 'jueves', horaInicio: '08:00', horaFin: '12:00', activo: true }
    ],
    requisitos: {
      ayuno: false,
      preparacion: 'No aplicar cremas o maquillaje en la zona a examinar'
    }
  }
];

// Datos de ejemplo para médicos
const medicosData = [
  {
    nombre: 'Carlos',
    apellido: 'Mendoza López',
    cmp: '12345',
    dni: '12345678',
    contacto: {
      telefono: '984123456',
      email: 'carlos.mendoza@hospital.pe',
      direccion: 'Av. El Sol 123, Cusco'
    },
    fechaNacimiento: new Date('1980-05-15'),
    genero: 'M',
    activo: true,
    horarios: [
      {
        dia: 'lunes',
        horaInicio: '08:00',
        horaFin: '12:00',
        activo: true,
        consultorio: 'C-101'
      },
      {
        dia: 'martes',
        horaInicio: '08:00',
        horaFin: '12:00',
        activo: true,
        consultorio: 'C-101'
      },
      {
        dia: 'miercoles',
        horaInicio: '08:00',
        horaFin: '12:00',
        activo: true,
        consultorio: 'C-101'
      },
      {
        dia: 'jueves',
        horaInicio: '08:00',
        horaFin: '12:00',
        activo: true,
        consultorio: 'C-101'
      },
      {
        dia: 'viernes',
        horaInicio: '08:00',
        horaFin: '12:00',
        activo: true,
        consultorio: 'C-101'
      }
    ],
    costos: {
      consulta: 80,
      control: 60
    }
  },
  {
    nombre: 'Ana María',
    apellido: 'Quispe Huamán',
    cmp: '23456',
    dni: '23456789',
    contacto: {
      telefono: '984234567',
      email: 'ana.quispe@hospital.pe'
    },
    fechaNacimiento: new Date('1975-08-22'),
    genero: 'F',
    activo: true,
    horarios: [
      {
        dia: 'lunes',
        horaInicio: '14:00',
        horaFin: '18:00',
        activo: true,
        consultorio: 'C-201'
      },
      {
        dia: 'miercoles',
        horaInicio: '14:00',
        horaFin: '18:00',
        activo: true,
        consultorio: 'C-201'
      },
      {
        dia: 'viernes',
        horaInicio: '14:00',
        horaFin: '18:00',
        activo: true,
        consultorio: 'C-201'
      }
    ],
    costos: {
      consulta: 120,
      control: 90
    }
  },
  {
    nombre: 'José Luis',
    apellido: 'Vargas Ccama',
    cmp: '34567',
    dni: '34567890',
    contacto: {
      telefono: '984345678',
      email: 'jose.vargas@hospital.pe'
    },
    fechaNacimiento: new Date('1982-03-10'),
    genero: 'M',
    activo: true,
    horarios: [
      {
        dia: 'lunes',
        horaInicio: '08:00',
        horaFin: '16:00',
        activo: true,
        consultorio: 'C-301'
      },
      {
        dia: 'martes',
        horaInicio: '08:00',
        horaFin: '16:00',
        activo: true,
        consultorio: 'C-301'
      },
      {
        dia: 'miercoles',
        horaInicio: '08:00',
        horaFin: '16:00',
        activo: true,
        consultorio: 'C-301'
      },
      {
        dia: 'jueves',
        horaInicio: '08:00',
        horaFin: '16:00',
        activo: true,
        consultorio: 'C-301'
      },
      {
        dia: 'viernes',
        horaInicio: '08:00',
        horaFin: '12:00',
        activo: true,
        consultorio: 'C-301'
      }
    ],
    costos: {
      consulta: 90,
      control: 70
    }
  }
];

// Datos de ejemplo para pacientes
const pacientesData = [
  {
    nombre: 'María Elena',
    apellido: 'Gutierrez Rojas',
    dni: '45678901',
    fechaNacimiento: new Date('1990-07-15'),
    genero: 'F',
    telefono: '984567890',
    email: 'maria.gutierrez@email.com',
    direccion: {
      calle: 'Jr. Triunfo 234',
      distrito: 'Wanchaq',
      ciudad: 'Cusco',
      codigoPostal: '08006'
    },
    contactoEmergencia: {
      nombre: 'Pedro Gutierrez',
      telefono: '984111222',
      relacion: 'Esposo'
    },
    seguro: {
      tipo: 'SIS',
      numero: 'SIS123456789',
      activo: true
    },
    activo: true
  },
  {
    nombre: 'Roberto',
    apellido: 'Mamani Condori',
    dni: '56789012',
    fechaNacimiento: new Date('1985-12-03'),
    genero: 'M',
    telefono: '984678901',
    email: 'roberto.mamani@email.com',
    direccion: {
      calle: 'Av. La Cultura 567',
      distrito: 'San Sebastián',
      ciudad: 'Cusco',
      codigoPostal: '08000'
    },
    contactoEmergencia: {
      nombre: 'Carmen Condori',
      telefono: '984222333',
      relacion: 'Madre'
    },
    seguro: {
      tipo: 'ESSALUD',
      numero: 'ESS987654321',
      activo: true
    },
    activo: true
  },
  {
    nombre: 'Lucia',
    apellido: 'Flores Inca',
    dni: '67890123',
    fechaNacimiento: new Date('2015-09-20'),
    genero: 'F',
    telefono: '984789012',
    direccion: {
      calle: 'Calle Saphi 890',
      distrito: 'Cusco',
      ciudad: 'Cusco',
      codigoPostal: '08001'
    },
    contactoEmergencia: {
      nombre: 'Rosa Inca',
      telefono: '984333444',
      relacion: 'Madre'
    },
    seguro: {
      tipo: 'SIS',
      numero: 'SIS456789123',
      activo: true
    },
    activo: true
  }
];

async function initializeDatabase() {
  try {
    // Conectar a MongoDB
    await connectDB();
    console.log('✅ Conectado a MongoDB');

    // Limpiar colecciones existentes
    await Promise.all([
      Especialidad.deleteMany({}),
      Medico.deleteMany({}),
      Paciente.deleteMany({}),
      Cita.deleteMany({})
    ]);
    console.log('🧹 Colecciones limpiadas');

    // Crear especialidades
    const especialidades = await Especialidad.insertMany(especialidadesData);
    console.log(`✅ ${especialidades.length} especialidades creadas`);

    // Asignar especialidades a médicos
    medicosData[0].especialidades = [especialidades[0]._id]; // Medicina General
    medicosData[1].especialidades = [especialidades[1]._id]; // Cardiología
    medicosData[2].especialidades = [especialidades[2]._id]; // Pediatría

    // Crear médicos
    const medicos = await Medico.insertMany(medicosData);
    console.log(`✅ ${medicos.length} médicos creados`);

    // Crear pacientes
    const pacientes = await Paciente.insertMany(pacientesData);
    console.log(`✅ ${pacientes.length} pacientes creados`);

    // Crear algunas citas de ejemplo
    const citasData = [
      {
        paciente: pacientes[0]._id,
        medico: medicos[0]._id,
        especialidad: especialidades[0]._id,
        fechaCita: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mañana
        horaCita: '09:00',
        duracionMinutos: 30,
        tipoCita: 'CONSULTA',
        prioridad: 'NORMAL',
        estado: 'PROGRAMADA',
        motivoConsulta: 'Control de rutina y chequeo general',
        costo: {
          consulta: 80,
          procedimientos: 0,
          total: 80
        },
        seguro: {
          cubre: true,
          copago: 0
        }
      },
      {
        paciente: pacientes[1]._id,
        medico: medicos[1]._id,
        especialidad: especialidades[1]._id,
        fechaCita: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Pasado mañana
        horaCita: '14:30',
        duracionMinutos: 45,
        tipoCita: 'CONSULTA',
        prioridad: 'ALTA',
        estado: 'CONFIRMADA',
        motivoConsulta: 'Dolor en el pecho y palpitaciones',
        observaciones: 'Paciente refiere síntomas desde hace 1 semana',
        costo: {
          consulta: 120,
          procedimientos: 0,
          total: 120
        },
        seguro: {
          cubre: true,
          copago: 20
        }
      },
      {
        paciente: pacientes[2]._id,
        medico: medicos[2]._id,
        especialidad: especialidades[2]._id,
        fechaCita: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // En 3 días
        horaCita: '10:00',
        duracionMinutos: 30,
        tipoCita: 'CONTROL',
        prioridad: 'NORMAL',
        estado: 'PROGRAMADA',
        motivoConsulta: 'Control de crecimiento y desarrollo',
        observaciones: 'Control mensual programado',
        costo: {
          consulta: 90,
          procedimientos: 0,
          total: 90
        },
        seguro: {
          cubre: true,
          copago: 0
        }
      }
    ];

    const citas = await Cita.insertMany(citasData);
    console.log(`✅ ${citas.length} citas creadas`);

    console.log('\n🎉 Base de datos inicializada correctamente!');
    console.log('📊 Resumen de datos creados:');
    console.log(`   - Especialidades: ${especialidades.length}`);
    console.log(`   - Médicos: ${medicos.length}`);
    console.log(`   - Pacientes: ${pacientes.length}`);
    console.log(`   - Citas: ${citas.length}`);

  } catch (error) {
    console.error('❌ Error inicializando la base de datos:', error);
  } finally {
    // Cerrar conexión
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada');
    process.exit(0);
  }
}

// Ejecutar si el archivo se llama directamente
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;
