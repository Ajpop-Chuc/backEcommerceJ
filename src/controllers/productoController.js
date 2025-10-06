const { Producto } = require('../models');

const productoController = {
  // GET /api/productos
  getAllProductos: async (req, res) => {
    try {
      const productos = await Producto.findAll();
      res.json({
        success: true,
        data: productos
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo productos',
        error: error.message
      });
    }
  },

  // GET /api/productos/:id
  getProductoById: async (req, res) => {
    try {
      const { id } = req.params;
      const producto = await Producto.findByPk(id);
      
      if (!producto) {
        return res.status(404).json({
          success: false,
          message: 'Producto no encontrado'
        });
      }

      res.json({
        success: true,
        data: producto
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo producto',
        error: error.message
      });
    }
  },

  // POST /api/productos
  createProducto: async (req, res) => {
    try {
      const { nombre, descripcion, precio_unitario, estado } = req.body;
      
      const nuevoProducto = await Producto.create({
        nombre,
        descripcion,
        precio_unitario,
        estado: estado !== undefined ? estado : true
      });

      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error creando producto',
        error: error.message
      });
    }
  }
};

module.exports = productoController;