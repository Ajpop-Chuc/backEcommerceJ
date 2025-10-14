const express = require('express');
const router = express.Router();
const sucursalProductoController = require('../controllers/sucursalProductoController');  

// Rutas para sucursales
router.get('/', sucursalProductoController.getAllSucursalProductos);

module.exports = router;