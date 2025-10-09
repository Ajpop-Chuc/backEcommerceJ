require('dotenv').config();
const express = require('express');
const { testConnection } = require('./database/config');
//const { initModels } = require('./src/models');
const routes = require('./src/routes');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite todas las origins (solo desarrollo)
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Usar todas las rutas
app.use('/', routes);

const startServer = async () => {
  try {
    // Verificar conexión a BD
      console.log('='.repeat(60));
    const dbConnected = await testConnection();
    if (!dbConnected) {
      throw new Error('No se pudo conectar a la base de datos');
    }

    // Inicializar modelos
    //await initModels();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📊 Base de datos: ${process.env.DB_NAME}`);
      console.log(`🌱 Entorno: ${process.env.NODE_ENV}`);
      console.log('='.repeat(60));
    });

  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error.message);
    process.exit(1);
  }
};

// Manejar cierre graceful
process.on('SIGINT', () => {
  console.log('\n🛑 Apagando servidor ...');
  process.exit(0);
});

// Iniciar aplicación
startServer();