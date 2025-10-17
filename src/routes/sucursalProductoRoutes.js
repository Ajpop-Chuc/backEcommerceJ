const express = require('express');
const router = express.Router();
const sucursalProductoController = require('../controllers/sucursalProductoController');  

// Rutas para sucursales
router.get('/producto_sucursales', sucursalProductoController.getAllProductoSucursalesFormatted);
router.get('/sucursal-productos/:id', sucursalProductoController.getSucursalProductosFormattedById);
router.put('/trasladarProductos/:id_producto/:id_origen/:id_destino/:cantidad', sucursalProductoController.trasladarProducto);

module.exports = router;