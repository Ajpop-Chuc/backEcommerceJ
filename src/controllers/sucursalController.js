const { Sucursal } = require('../models');
const { get } = require('../routes');

const sucursalController = {
    // GET /api/sucursales
    getAllSucursales: async (req, res) => {
        try {
            const sucursales = await Sucursal.findAll();
            res.json(sucursales);
        } catch (error) {
            console.error('Error al obtener sucursales:', error);
            res.status(500).json({ error: 'Error al obtener sucursales' });
        }
    },

    // GET /api/sucursales/:id
    getSucursalById: async (req, res) => {
        const { id } = req.params;
        try {
            const sucursal = await Sucursal.findByPk(id);
            if (!sucursal) {
                return res.status(404).json({ error: 'Sucursal no encontrada' });
            }
            res.json(sucursal);
        } catch (error) {
            console.error('Error al obtener la sucursal:', error);
            res.status(500).json({ error: 'Error al obtener la sucursal' });
        }
    },

    // POST /api/sucursales
    createSucursal: async (req, res) => {
        const { nombre, direccion, telefono, estado } = req.body;
        try {
            const nuevaSucursal = await Sucursal.create({ nombre, direccion, telefono, estado });
            res.status(201).json(nuevaSucursal);
        } catch (error) {
            console.error('Error al crear la sucursal:', error);
            res.status(500).json({ error: 'Error al crear la sucursal' });
        }
    },

    // PUT /api/sucursales/:id
    updateSucursal: async (req, res) => {
        const { id } = req.params;
        const { nombre, direccion, telefono, estado } = req.body;
        try {
            const [updated] = await Sucursal.update(
                { nombre, direccion, telefono, estado },
                { where: { id_sucursal: id } }
            );
            if (!updated) {
                return res.status(404).json({ error: 'Sucursal no encontrada' });
            }
            res.json({ message: 'Sucursal actualizada con éxito' });
        } catch (error) {
            console.error('Error al actualizar la sucursal:', error);
            res.status(500).json({ error: 'Error al actualizar la sucursal' });
        }
    },

};

module.exports = sucursalController;