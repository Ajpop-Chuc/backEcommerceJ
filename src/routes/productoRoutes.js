const express = require('express');
const router = express.Router();
const productoController = require('../controllers/ProductoController');

// Todas estas rutas tienen prefijo /api/productos
router.get('/', productoController.getAllProductos);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.createProducto);

module.exports = router;