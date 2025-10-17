const {SucursalProducto, Sucursal, Producto} = require('../models');
const { Sequelize } = require('sequelize');
const { sequelize } = require('../../database/config');

const sucursalProductoController = {
    getAllProductoSucursalesFormatted: async (req, res) => {
        try {
            const sucursales = await Sucursal.findAll({
                include: [{
                    model: SucursalProducto,
                    include: [{
                        model: Producto,
                        where: { estado: true } // Solo productos activos
                    }],
                    where: {
                        cantidad_disponible: {
                            [Sequelize.Op.gt]: 0 // Solo donde hay stock
                        }
                    }
                }],
                where: { estado: true } // Solo sucursales activas
            });

            // Formatear la respuesta
            const resultado = sucursales.map(sucursal => ({
                id_sucursal: sucursal.id_sucursal,
                nombre: sucursal.nombre,
                direccion: sucursal.direccion,
                telefono: sucursal.telefono,
                estado: sucursal.estado,
                productos: sucursal.SucursalProductos.map(sp => ({
                    id_producto: sp.Producto.id_producto,
                    nombre: sp.Producto.nombre,
                    descripcion: sp.Producto.descripcion,
                    precio_unitario: sp.Producto.precio_unitario,
                    estado: sp.Producto.estado,
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

    // GET /api/sucursal-productos-no-ids
     getSucursalProductosFormattedById: async (req, res) => {
       try {
            const { id } = req.params;
            const producto = await Producto.findOne({
                where: { 
                    id_producto: id, 
                    estado: true 
                },
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
                }]
            });

            if (!producto) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }

            // Formatear la respuesta (no necesitas map para un solo objeto)
            const resultado = {
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
            };

            res.json(resultado);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            res.status(500).json({ error: 'Error al obtener el producto' });
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

    // PUT /api/sucursales/traslado/:id_producto/:id_origen/:id_destino/:cantidad
    trasladarProducto: async (req, res) => {
        const { id_producto, id_origen, id_destino, cantidad } = req.params;
        const t = await sequelize.transaction(); // Iniciar transacción

        try {
            // 1. Buscar el registro de origen
            const stockOrigen = await SucursalProducto.findOne({
                where: { 
                    producto_id_producto: id_producto,
                    sucursal_id_sucursal: id_origen 
                },
                transaction: t
            });

            if (!stockOrigen) {
                await t.rollback();
                return res.status(404).json({ error: 'Producto no encontrado en sucursal de origen' });
            }

            // 2. Verificar stock suficiente
            if (stockOrigen.cantidad_disponible < cantidad) {
                await t.rollback();
                return res.status(400).json({ error: 'Stock insuficiente en sucursal de origen' });
            }

            // 3. Buscar o crear registro en destino
            let stockDestino = await SucursalProducto.findOne({
                where: { 
                    producto_id_producto: id_producto,
                    sucursal_id_sucursal: id_destino 
                },
                transaction: t
            });

            if (!stockDestino) {
                // Crear nuevo registro si no existe
                stockDestino = await SucursalProducto.create({
                    producto_id_producto: id_producto,
                    sucursal_id_sucursal: id_destino,
                    cantidad_disponible: 0
                }, { transaction: t });
            }

            // 4. Actualizar stocks
            await SucursalProducto.update(
                { cantidad_disponible: stockOrigen.cantidad_disponible - parseInt(cantidad) },
                { 
                    where: { 
                        producto_id_producto: id_producto,
                        sucursal_id_sucursal: id_origen 
                    },
                    transaction: t 
                }
            );

            await SucursalProducto.update(
                { cantidad_disponible: stockDestino.cantidad_disponible + parseInt(cantidad) },
                { 
                    where: { 
                        producto_id_producto: id_producto,
                        sucursal_id_sucursal: id_destino 
                    },
                    transaction: t 
                }
            );

            // 5. Confirmar transacción
            await t.commit();
            
            res.json({ 
                message: 'Producto trasladado con éxito',
                detalles: {
                    producto_id: id_producto,
                    desde_sucursal: id_origen,
                    hacia_sucursal: id_destino,
                    cantidad_trasladada: cantidad
                }
            });
            
        } catch (error) {
            // Revertir transacción en caso de error
            await t.rollback();
            console.error('Error al trasladar el producto:', error);
            res.status(500).json({ error: 'Error al trasladar el producto' });
        }
    }
};

module.exports = sucursalProductoController;