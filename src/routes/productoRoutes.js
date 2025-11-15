const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productoController');
const upload = require('../middleware/upload');


// Todas estas rutas tienen prefijo /api/productos
router.get('/', productoController.getAllProductos);
// ruta para mostrar unicamente productos desactivados
router.get('/desactivados_cantidades', productoController.getProductosDesactivadosConCantidad);
router.get('/productos_cantidades', productoController.getProductosConCantidad);
// ruta para crear un producto con imagen, donde primero la peticion pasa por el middleware de subida de imagen
router.post('/', upload.single('imagen'), productoController.createProducto);
// ruta para que tambien pase por el middleware de subida de imagen al actualizar
router.put('/:id', upload.single('imagen'), productoController.updateProducto);
router.get('/:id', productoController.getProductoById);
router.delete('/:id', productoController.deleteProducto);

//ruta para desactivar un producto (cambiar su estado a false)
router.patch('/:id/status', productoController.updateProductStatus);


module.exports = router;