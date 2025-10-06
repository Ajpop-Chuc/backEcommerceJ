const {PermisoAcceso} = require('../models');

const permisoAccesoController = {
    //GET /api/permiso-acceso
    getAllPermisos: async (req, res) => {
        try {
            const permisos = await PermisoAcceso.findAll();
            res.json(permisos);
        } catch (error) {
            console.error('Error al obtener permisos:', error);
            res.status(500).json({ error: 'Error obteniendo permisos' });
        }
    },

    //GET /api/permiso-acceso/:id
    getPermisoById: async (req, res) => {
        const { id } = req.params;
        try {
            const permiso = await PermisoAcceso.findByPk(id);
            if (!permiso) {
                return res.status(404).json({ error: 'Permiso no encontrado' });
            }
            res.json(permiso);
        } catch (error) {
            console.error('Error al obtener permiso:', error);
            res.status(500).json({ error: 'Error obteniendo permiso' });
        }
    },

    //POST /api/permiso-acceso
    createPermiso: async (req, res) => {
        const { nombre, estado, rol_id_rol } = req.body;
        try {
            const nuevoPermiso = await PermisoAcceso.create({ nombre, estado, rol_id_rol });
            res.status(201).json(nuevoPermiso);
        } catch (error) {
            console.error('Error al crear permiso:', error);
            res.status(500).json({ error: 'Error creando permiso' });
        }
    },

    //PUT /api/permiso-acceso/:id
    updatePermiso: async (req, res) => {
        const { id } = req.params;
        const { nombre, estado, rol_id_rol } = req.body;
        try {
            const [updated] = await PermisoAcceso.update({ nombre, estado, rol_id_rol }, { where: { id_permiso_acceso: id } });
            if (!updated) {
                return res.status(404).json({ error: 'Permiso no encontrado' });
            }
            const permisoActualizado = await PermisoAcceso.findByPk(id);
            res.json(permisoActualizado);
        } catch (error) {
            console.error('Error al actualizar permiso:', error);
            res.status(500).json({ error: 'Error actualizando permiso' });
        }
    }
};