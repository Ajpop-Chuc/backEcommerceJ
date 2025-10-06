const express = require('express');
const router = express.Router();
const historialCambioController = require('../controllers/historialCambioController');

router.get('/', historialCambioController.getAllHistorialCambios);
router.get('/:id', historialCambioController.getHistorialCambioById);
router.post('/', historialCambioController.createHistorialCambio);
router.put('/:id', historialCambioController.updateHistorialCambio);

module.exports = router;
