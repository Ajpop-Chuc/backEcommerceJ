const express = require('express');
const router = express.Router();

// Importar rutas específicas
const productoRoutes = require('./productoRoutes');

// Definir prefijos
router.use('/api/productos', productoRoutes);

// Ruta de health check
router.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV 
  });
});

// Ruta raíz
router.get('/', (req, res) => {
  res.json({ 
    message: 'Bienvenido a la API de Tienda Online',
    version: '1.0.0'
  });
});

module.exports = router;