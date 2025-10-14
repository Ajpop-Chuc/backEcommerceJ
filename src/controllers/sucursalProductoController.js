const {SucursalProducto, Sucursal, Producto} = require('../models');
const { Sequelize } = require('sequelize');

const sucursalProductoController = {
    // GET /api/sucursal-productos
     getAllSucursalProductos: async (req, res) => {
        try {
            const productos = await Producto.findAll({
                include: [{
                    model: SucursalProducto,
                    include: [{
                        model: Sucursal,
                        where: { estado: true } // Solo sucursales activas
                    }],
                    where: {
                        cantidad_disponible: {
                            [Sequelize.Op.gt]: 0 // Solo donde hay stock
                        }
                    }
                }],
                where: { estado: true } // Solo productos activos
            });

            // Formatear la respuesta
            const resultado = productos.map(producto => ({
                id_producto: producto.id_producto,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio_unitario: producto.precio_unitario,
                estado: producto.estado,
                sucursales: producto.SucursalProductos.map(sp => ({
                    id_sucursal: sp.Sucursal.id_sucursal,
                    nombre: sp.Sucursal.nombre,
                    direccion: sp.Sucursal.direccion,
                    telefono: sp.Sucursal.telefono,
                    cantidad_disponible: sp.cantidad_disponible,
                    id_sucursal_producto: sp.id_sucursal_producto
                }))
            }));

            res.json(resultado);
        } catch (error) {
            console.error('Error al obtener sucursal-productos:', error);
            res.status(500).json({ error: 'Error al obtener sucursal-productos' });
        }
    },

    // GET /api/sucursal-productos/:id
    getSucursalProductoById: async (req, res) => {
        const { id } = req.params;
        try {
            const sucursalProducto = await SucursalProducto.findByPk(id);
            if (!sucursalProducto) {
                return res.status(404).json({ error: 'Sucursal-Producto no encontrado' });
            }
            res.json(sucursalProducto);
        } catch (error) {
            console.error('Error al obtener la sucursal-producto:', error);
            res.status(500).json({ error: 'Error al obtener la sucursal-producto' });
        }
    },

    // POST /api/sucursal-productos
    createSucursalProducto: async (req, res) => {
        const { sucursal_id_sucursal, producto_id_producto, cantidad_disponible } = req.body;
        try {
            const nuevaSucursalProducto = await SucursalProducto.create({ sucursal_id_sucursal, producto_id_producto, cantidad_disponible });
            res.status(201).json(nuevaSucursalProducto);
        } catch (error) {
            console.error('Error al crear la sucursal-producto:', error);
            res.status(500).json({ error: 'Error al crear la sucursal-producto' });
        }
    },

    // PUT /api/sucursal-productos/:id
    updateSucursalProducto: async (req, res) => {
        const { id } = req.params;
        const { id_sucursal, id_producto, cantidad_disponible } = req.body;
        try {
            const [updated] = await SucursalProducto.update(
                { sucursal_id_sucursal: id_sucursal, producto_id_producto: id_producto, cantidad_disponible },
                { where: { id_sucursal_producto: id } }
            );
            if (!updated) {
                return res.status(404).json({ error: 'Sucursal-Producto no encontrado' });
            }
            res.json({ message: 'Sucursal-Producto actualizado con éxito' });
        } catch (error) {
            console.error('Error al actualizar la sucursal-producto:', error);
            res.status(500).json({ error: 'Error al actualizar la sucursal-producto' });
        }
    },

};

module.exports = sucursalProductoController;