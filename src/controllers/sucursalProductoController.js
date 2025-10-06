const {sucursalProducto} = require('../models');

const sucursalProductoController = {
    // GET /api/sucursal-productos
    getAllSucursalProductos: async (req, res) => {
        try {
            const sucursalProductos = await sucursalProducto.findAll();
            res.json(sucursalProductos);
        } catch (error) {
            console.error('Error al obtener sucursal-productos:', error);
            res.status(500).json({ error: 'Error al obtener sucursal-productos' });
        }
    },

    // GET /api/sucursal-productos/:id
    getSucursalProductoById: async (req, res) => {
        const { id } = req.params;
        try {
            const sucursalProducto = await sucursalProducto.findByPk(id);
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
            const nuevaSucursalProducto = await sucursalProducto.create({ sucursal_id_sucursal, producto_id_producto, cantidad_disponible });
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
            const [updated] = await sucursalProducto.update(
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