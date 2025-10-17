const { Producto, SucursalProducto, Sucursal } = require('../models');
const { sequelize } = require('../../database/config');

const productoController = {
  // GET /api/productos
  getAllProductos: async (req, res) => {
    try {
      const productos = await Producto.findAll();
      res.json(productos);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({error: 'Error obteniendo productos'});
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

      res.json(producto);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error obteniendo producto',
        error: error.message
      });
    }
  },

  // GET /api/productos_cantidades
  getProductosConCantidad: async (req, res) => {
    try {
      // Aqui se SUMAN todas las cantidades de productos con el mismo id_producto en todas las sucursales en la tabla SucursalProducto
      const productos = await Producto.findAll({
        attributes: ['id_producto', 'nombre', 'descripcion', 'precio_unitario', 'estado',
          [sequelize.fn('SUM', sequelize.col('SucursalProductos.cantidad_disponible')), 'cantidad_total']
        ],
        include: [{
          model: SucursalProducto,
          attributes: [],
        }],
        group: ['Producto.id_producto']        
      });

      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
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
  },

  // PUT /api/productos/:id
  updateProducto: async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio_unitario, estado } = req.body;  
      const [updated] = await Producto.update(
        { nombre, descripcion, precio_unitario, estado },
        { where: { id_producto: id } }
      );
      if (!updated) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      res.json({ message: 'Producto actualizado con éxito' });
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  },

};

module.exports = productoController;