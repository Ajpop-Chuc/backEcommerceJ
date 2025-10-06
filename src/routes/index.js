const express = require('express');
const router = express.Router();

// Importar rutas específicas
const productoRoutes = require('./productoRoutes'); // Si tienes rutas para productos
const sucursalesRoutes = require('./sucursalesRoutes'); // Si tienes rutas para sucursales
const sucursalProductoRoutes = require('./sucursalProductoRoutes'); // Si tienes rutas para sucursales-productos
const rolRoutes = require('./rolRoutes'); // Si tienes rutas para roles
const historialCambioRoutes = require('./historialCambioRoutes'); // Si tienes rutas para historial de cambios
const usuarioRoutes = require('./usuarioRoutes'); // Si tienes rutas para usuarios

// Definir prefijos
router.use('/api/productos', productoRoutes);
router.use('/api/sucursales', sucursalesRoutes);
router.use('/api/sucursal-productos', sucursalProductoRoutes);
router.use('/api/roles', rolRoutes);
router.use('/api/historial_cambios', historialCambioRoutes);
router.use('/api/usuarios', usuarioRoutes);



















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