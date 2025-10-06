const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');  

// Rutas para sucursales
router.get('/', sucursalController.getAllSucursales);

module.exports = router;