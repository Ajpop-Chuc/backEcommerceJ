const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');

// Todas estas rutas tienen prefijo /api/productos
router.get('/', productoController.getAllProductos);
router.get('/productos_cantidades', productoController.getProductosConCantidad);
router.get('/:id', productoController.getProductoById);
router.post('/', productoController.createProducto);
router.put('/:id', productoController.updateProducto);

module.exports = router;