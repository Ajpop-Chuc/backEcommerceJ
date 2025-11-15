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
        where: { estado: true },  // Solo productos activos
        attributes: ['id_producto', 'nombre', 'descripcion', 'precio_unitario', 'estado',
          [sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('SucursalProductos.cantidad_disponible')), 0), 'cantidad_total']
        ],
        include: [{
          model: SucursalProducto,
          attributes: [],
          required: false // Incluye productos aunque no tengan entradas en SucursalProducto
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
    //1.1 Inicio de transaccion
    const t = await sequelize.transaction();

    try {
      // 1. obtener el string Json del body en lugar de campos individuales
      const { 
        nombre, 
        descripcion, 
        precio_unitario, 
        estado, 
        stock_inicial // string json ejemplo: { "sucursal_id_sucursal": 1, "cantidad_disponible": 50 }
       } = req.body;
      
      // 2. La información del archivo viene en req.file
      let imagenUrl = null;
      if (req.file) {
        // Simplemente guardamos la ruta relativa que construimos
        imagenUrl = `uploads/${req.file.filename}`; 
      }

      // 3.1 creacion del producto dentro de la transaccion
      const nuevoProducto = await Producto.create({
        nombre,
        descripcion,
        precio_unitario,
        estado: estado !== undefined ? estado : true,
        imagen_url: imagenUrl // 4. Guardamos la URL de la imagen
      }, { transaction: t }); // pasa la transaccion

      //4.1 obtener el id del producto recien creado
      const productoId = nuevoProducto.id_producto;

      // 5. parsear el stock inicial
      const stockItems = JSON.parse(stock_inicial);

      if (!Array.isArray(stockItems) || stockItems.length === 0) {
        throw new Error("No se proporcionó stock inicial válido");
      }

      // mapear y crear cada entrada de inventario inicial
      const stockparaCrear = stockItems.map(item => ({
        sucursal_id_sucursal: item.sucursal_id_sucursal,
        producto_id_producto: productoId,
        cantidad_disponible: item.cantidad_disponible
      }));

      //5 se utiliza un bulkcreate para insertar todos los registros de stick a la vez
      await SucursalProducto.bulkCreate(stockparaCrear, { transaction: t });

      // 6.1 commit de la transaccion
      await t.commit();
  
      res.status(201).json({
        success: true,
        message: 'Producto creado exitosamente',
        data: nuevoProducto
      });
    } catch (error) {
      await t.rollback(); // 6.2 rollback en caso de error
      res.status(500).json({
        success: false,
        message: 'Error creando producto',
        error: error.message
      });
    }
  },

  // PUT /api/productos/:id
  updateProducto: async (req, res) => {
      const { id } = req.params;
      const t = await sequelize.transaction(); // 1. Inicia Transacción 

      try {
      // 2. Obtenemos datos del FormData
      const { 
        nombre, 
        descripcion, 
        precio_unitario, 
        estado,
        stock_inicial // <-- Esperamos el mismo string JSON que en 'crear'
      } = req.body;

      // 3. Busca el producto
      const producto = await Producto.findByPk(id, { transaction: t });
      if (!producto) {
        await t.rollback();
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // 4. Prepara los datos del producto
      const datosParaActualizar = {
        nombre,
        descripcion,
        precio_unitario,
        estado: estado !== undefined ? estado : producto.estado,
      };

      //revisar si se subio una nueva imagen
      if (req.file) {
        // Actualiza la URL de la imagen si se subió una nueva
        datosParaActualizar.imagen_url = `uploads/${req.file.filename}`;

        // Borrar la imagen anterior del servidor si existe
        const fs = require('fs');
        const path = require('path');
        if (producto.imagen_url) {
          fs.unlink(path.join(__dirname, '..', '..', producto.imagen_url), (err) => {
            if (err) 
              console.error('Error al borrar la imagen antigua:', err);

            });
          }
        }
      

      // actualizar el producto en la bd
      await producto.update(datosParaActualizar, { transaction: t });

      // 7. Procesa el stock
      if (stock_inicial) {
        const stockItems = JSON.parse(stock_inicial);

        // 8. Prepara los datos para el "UPSERT"
        const stockParaActualizar = stockItems.map(item => ({
          sucursal_id_sucursal: item.sucursal_id_sucursal,
          producto_id_producto: id, // El ID del producto que estamos editando
          cantidad_disponible: item.cantidad_disponible
          }));

        // bulkCreate con updateOnduplicate para hacer "upsert"
        await SucursalProducto.bulkCreate(stockParaActualizar, {
          transaction: t,
          updateOnDuplicate: ['cantidad_disponible']
        });
      }

      await t.commit();
      res.json({ message: 'Producto actualizado con éxito', data: producto });
    } catch (error) {
      await t.rollback(); // Revierte todo si algo falla
      console.error('Error al actualizar el producto:', error);
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  },

  // DELETE /api/productos/:id (Borrado suave)
  deleteProducto: async (req, res) => {
    try {
      const { id } = req.params;

      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Realizar el borrado suave (actualizar estado a false/inactivo)
      await producto.update({ estado: false });

      res.json({ message: 'Producto desactivado con éxito' });
    } catch (error) {
      console.error('Error al desactivar el producto:', error);
      res.status(500).json({ error: 'Error al desactivar el producto' });
    }
  },

  // Obtener solo productos desactivados
  getProductosDesactivadosConCantidad: async (req, res) => {
    try {
      // Es la misma consulta que 'getProductosConCantidad' pero con where: { estado: false }
      const productos = await Producto.findAll({
        where: { estado: false }, // Solo productos desactivados
        attributes: [
          'id_producto', 'nombre', 'descripcion', 'precio_unitario', 'estado',
          [sequelize.fn('COALESCE',sequelize.fn('SUM', sequelize.col('SucursalProductos.cantidad_disponible')),0), 'cantidad_total']
        ],
        include: [{
          model: SucursalProducto,
          attributes: [],
          required: false // Incluye productos aunque no tengan entradas en SucursalProducto
        }],
        group: ['Producto.id_producto']      
      });
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Funciona para activar o desactivar un producto
  updateProductStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body; // Esperamos un JSON simple: { "estado": true } o { "estado": false }

      if (estado === undefined) {
        return res.status(400).json({ error: 'El campo "estado" es requerido.' });
      }

      const producto = await Producto.findByPk(id);
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      await producto.update({ estado });
      
      const message = estado ? 'Producto activado con éxito' : 'Producto desactivado con éxito';
      res.json({ message, data: producto });

    } catch (error) {
      console.error('Error al actualizar estado del producto:', error);
      res.status(500).json({ error: 'Error al actualizar estado del producto' });
    }
  },

};

module.exports = productoController;