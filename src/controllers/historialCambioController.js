const { HistorialCambio } = require('../models');

const historialCambioController = {
    // GET /api/historial-cambios
    getAllHistorialCambios: async (req, res) => {
        try {
            const historialCambios = await HistorialCambio.findAll();
            res.json(historialCambios);
        } catch (error) {
            console.error('Error al obtener historial de cambios:', error);
            res.status(500).json({ error: 'Error al obtener historial de cambios' });
        }
    },
    // GET /api/historial-cambios/:id
    getHistorialCambioById: async (req, res) => {
        const { id } = req.params;
        try {
            const historialCambio = await HistorialCambio.findByPk(id);
            if (!historialCambio) {
                return res.status(404).json({ error: 'Historial de cambio no encontrado' });
            }
            res.json(historialCambio);
        } catch (error) {
            console.error('Error al obtener historial de cambio por ID:', error);
            res.status(500).json({ error: 'Error al obtener historial de cambio por ID' });
        }
    },
    // POST /api/historial-cambios
    createHistorialCambio: async (req, res) => {
        const { producto_id_producto, precio_anterior, precio_nuevo, fecha_cambio } = req.body;
        try {
            const nuevoHistorialCambio = await HistorialCambio.create({
                producto_id_producto,
                precio_anterior,
                precio_nuevo,
                fecha_cambio
            });
            res.status(201).json(nuevoHistorialCambio);
        } catch (error) {
            console.error('Error al crear historial de cambio:', error);
            res.status(500).json({ error: 'Error al crear historial de cambio' });
        }
    },
    // PUT /api/historial-cambios/:id
    updateHistorialCambio: async (req, res) => {
        const { id } = req.params;
        const { producto_id_producto, precio_anterior, precio_nuevo, fecha_cambio } = req.body;

        try {
            const historialCambio = await HistorialCambio.findByPk(id);
            if (!historialCambio) {
                return res.status(404).json({ error: 'Historial de cambio no encontrado' });
            }

            // Actualizar los campos del historial de cambio
            historialCambio.producto_id_producto = producto_id_producto;
            historialCambio.precio_anterior = precio_anterior;
            historialCambio.precio_nuevo = precio_nuevo;
            historialCambio.fecha_cambio = fecha_cambio;

            await historialCambio.save();
            res.json(historialCambio);
        } catch (error) {
            console.error('Error al actualizar historial de cambio:', error);
            res.status(500).json({ error: 'Error al actualizar historial de cambio' });
        }
    },
};
module.exports = historialCambioController;