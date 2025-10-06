const {Usuario} = require('../models');

const usuarioController = {
    //Get api/usuarios
    getAllUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.findAll();
            res.json(usuarios);
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        }
    },
    //Get api/usuarios/:id
    getUsuarioById: async (req, res) => {
        const { id } = req.params;
        try {
            const usuario = await Usuario.findByPk(id);
            if (usuario) {
                res.json(usuario);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('Error al obtener usuario por ID:', error);
            res.status(500).json({ error: 'Error al obtener usuario por ID' });
        }
    },
    //Post api/usuarios
    createUsuario: async (req, res) => {
        const { nombre, email, password, rol_id_rol } = req.body;
        try {
            const nuevoUsuario = await Usuario.create({ nombre, email, password, rol_id_rol });
            res.status(201).json(nuevoUsuario);
        } catch (error) {
            console.error('Error al crear usuario:', error);
            res.status(500).json({ error: 'Error al crear usuario' });
        }
    },
    //Put api/usuarios/:id
    updateUsuario: async (req, res) => {
        const { id } = req.params;
        const { nombre, email, password, rol_id_rol } = req.body;
        try {
            const [updated] = await Usuario.update(
                { nombre, email, password, rol_id_rol },
                { where: { id_usuario: id } }
            );
            if (updated) {
                const usuarioActualizado = await Usuario.findByPk(id);
                res.json(usuarioActualizado);
            } else {
                res.status(404).json({ error: 'Usuario no encontrado' });
            }
        } catch (error) {
            console.error('Error al actualizar usuario:', error);
            res.status(500).json({ error: 'Error al actualizar usuario' });
        }
    }

};

module.exports = usuarioController;