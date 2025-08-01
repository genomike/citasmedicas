const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';

async function testAPI() {
  console.log('🧪 PROBANDO API DEL SISTEMA DE CITAS MÉDICAS\n');
  
  try {
    // 1. Probar salud del servidor
    console.log('1️⃣ Probando salud del servidor...');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Servidor:', health.data.message);
    console.log('📊 Base de datos:', health.data.database);
    console.log('');

    // 2. Probar especialidades
    console.log('2️⃣ Probando especialidades...');
    const especialidades = await axios.get(`${BASE_URL}/especialidades`);
    console.log(`✅ ${especialidades.data.total} especialidades encontradas:`);
    especialidades.data.data.forEach(esp => {
      console.log(`   - ${esp.nombre} (${esp.categoria}) - $${esp.precio}`);
    });
    console.log('');

    // 3. Probar médicos
    console.log('3️⃣ Probando médicos...');
    const medicos = await axios.get(`${BASE_URL}/medicos`);
    console.log(`✅ ${medicos.data.total} médicos encontrados:`);
    medicos.data.data.forEach(med => {
      console.log(`   - ${med.nombre} ${med.apellido} (${med.especialidad}) - CMP: ${med.cmp}`);
    });
    console.log('');

    // 4. Probar pacientes
    console.log('4️⃣ Probando pacientes...');
    const pacientes = await axios.get(`${BASE_URL}/pacientes`);
    console.log(`✅ ${pacientes.data.total} pacientes encontrados:`);
    pacientes.data.data.forEach(pac => {
      console.log(`   - ${pac.nombre} ${pac.apellido} - DNI: ${pac.dni}`);
    });
    console.log('');

    // 5. Probar citas
    console.log('5️⃣ Probando citas...');
    const citas = await axios.get(`${BASE_URL}/citas`);
    console.log(`✅ ${citas.data.total} citas encontradas:`);
    citas.data.data.forEach(cita => {
      console.log(`   - ${cita.paciente?.nombre} ${cita.paciente?.apellido} con ${cita.medico?.nombre} ${cita.medico?.apellido}`);
      console.log(`     Fecha: ${cita.fecha} ${cita.hora} - Estado: ${cita.estado}`);
    });
    console.log('');

    // 6. Crear un nuevo paciente
    console.log('6️⃣ Creando nuevo paciente...');
    const nuevoPaciente = {
      nombre: 'Carlos',
      apellido: 'Prueba García',
      dni: '12345678',
      fechaNacimiento: '1990-01-01',
      telefono: '987654321',
      email: 'carlos.prueba@test.com'
    };

    const pacienteCreado = await axios.post(`${BASE_URL}/pacientes`, nuevoPaciente);
    console.log('✅ Paciente creado:', pacienteCreado.data.data.nombre, pacienteCreado.data.data.apellido);
    console.log('');

    // 7. Crear nueva cita
    console.log('7️⃣ Creando nueva cita...');
    const nuevaCita = {
      pacienteId: pacienteCreado.data.data.id,
      medicoId: medicos.data.data[0].id,
      especialidadId: especialidades.data.data[0].id,
      fecha: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hora: '15:30',
      motivo: 'Consulta de prueba desde test'
    };

    const citaCreada = await axios.post(`${BASE_URL}/citas`, nuevaCita);
    console.log('✅ Cita creada para:', citaCreada.data.data.paciente.nombre);
    console.log('   Con médico:', citaCreada.data.data.medico.nombre);
    console.log('   Fecha:', citaCreada.data.data.fecha, citaCreada.data.data.hora);
    console.log('');

    // 8. Confirmar la cita
    console.log('8️⃣ Confirmando cita...');
    const citaConfirmada = await axios.put(`${BASE_URL}/citas/${citaCreada.data.data.id}/confirmar`);
    console.log('✅ Cita confirmada:', citaConfirmada.data.data.estado);
    console.log('');

    console.log('🎉 ¡TODAS LAS PRUEBAS COMPLETADAS EXITOSAMENTE!');
    console.log('📊 RESUMEN:');
    console.log(`   - Especialidades: ${especialidades.data.total}`);
    console.log(`   - Médicos: ${medicos.data.total}`);
    console.log(`   - Pacientes: ${pacientes.data.total + 1} (incluyendo el creado)`);
    console.log(`   - Citas: ${citas.data.total + 1} (incluyendo la creada)`);
    console.log('');
    console.log('🚀 La API está funcionando perfectamente!');

  } catch (error) {
    console.error('❌ Error en las pruebas:');
    if (error.response) {
      console.error('📄 Respuesta del servidor:', error.response.status, error.response.data);
    } else if (error.request) {
      console.error('🔌 No se pudo conectar al servidor. ¿Está ejecutándose en puerto 5002?');
    } else {
      console.error('💥 Error:', error.message);
    }
  }
}

// Ejecutar pruebas
console.log('⏳ Esperando 2 segundos para que el servidor esté listo...');
setTimeout(testAPI, 2000);
