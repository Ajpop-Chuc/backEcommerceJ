const {Rol} = require('../models');

const rolController = {
    // GET /api/roles
    getAllRoles: async (req, res) => {
        try {
            const roles = await Rol.findAll();
            res.json(roles);
        } catch (error) {
            console.error('Error al obtener roles:', error);
            res.status(500).json({ error: 'Error al obtener roles' });
        }
    },

    // GET /api/roles/:id
    getRolById: async (req, res) => {
        const { id } = req.params;
        try {
            const rol = await Rol.findByPk(id);
            if (!rol) {
                return res.status(404).json({ error: 'Rol no encontrado' });
            }
            res.json(rol);
        } catch (error) {
            console.error('Error al obtener el rol:', error);
            res.status(500).json({ error: 'Error al obtener el rol' });
        }
    },

    // POST /api/roles
    createRol: async (req, res) => {
        const { nombre } = req.body;
        try {
            const nuevoRol = await Rol.create({ nombre });
            res.status(201).json(nuevoRol);
        } catch (error) {
            console.error('Error al crear el rol:', error);
            res.status(500).json({ error: 'Error al crear el rol' });
        }
    },

    // PUT /api/roles/:id
    updateRol: async (req, res) => {
        const { id } = req.params;
        const { nombre } = req.body;
        try {
            const [updated] = await Rol.update(
                { nombre , estado, descripcion },
                { where: { id_rol: id } }
            );
            if (!updated) {
                return res.status(404).json({ error: 'Rol no encontrado' });
            }
            res.json({ message: 'Rol actualizado con éxito' });
        } catch (error) {
            console.error('Error al actualizar el rol:', error);
            res.status(500).json({ error: 'Error al actualizar el rol' });
        }
    },

};

module.exports = rolController;
