const { Sequelize } = require('sequelize');

// Configuración de la base de datos
const sequelize = new Sequelize(
    process.env.DB_NAME || 'sistema_citas_medicas',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: process.env.NODE_ENV === 'development' ? console.log : false,
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
);

// Función para probar la conexión
const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida correctamente');
    } catch (error) {
        console.error('❌ Error al conectar con la base de datos:', error.message);
    }
};

module.exports = {
    sequelize,
    testConnection
};
