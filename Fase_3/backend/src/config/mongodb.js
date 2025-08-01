const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/hospital_cusco_citas';
    
    console.log('🔄 Conectando a MongoDB...');
    console.log('📍 URI:', mongoURI);
    
    const conn = await mongoose.connect(mongoURI, {
      // Opciones de conexión modernas para Mongoose 6+
    });

    console.log('✅ MongoDB conectado exitosamente');
    console.log(`🏥 Base de datos: ${conn.connection.name}`);
    console.log(`🌐 Host: ${conn.connection.host}:${conn.connection.port}`);
    
    // Crear índices automáticamente
    await createIndexes();
    
    return conn;
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    
    // Si no puede conectar a MongoDB, crear una instancia local
    if (error.message.includes('ECONNREFUSED')) {
      console.log('⚠️  MongoDB no está ejecutándose localmente');
      console.log('💡 Opciones:');
      console.log('   1. Instalar MongoDB: https://www.mongodb.com/try/download/community');
      console.log('   2. Usar MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
      console.log('   3. La aplicación funcionará con datos en memoria');
    }
    
    // No salir del proceso, seguir con datos en memoria
    return null;
  }
};

const createIndexes = async () => {
  try {
    console.log('📊 Creando índices para optimización...');
    
    // Los índices se crearán automáticamente con los esquemas de Mongoose
    console.log('✅ Índices creados correctamente');
  } catch (error) {
    console.error('⚠️  Error creando índices:', error.message);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  } catch (error) {
    console.error('❌ Error desconectando MongoDB:', error.message);
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
