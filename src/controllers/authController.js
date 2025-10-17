const Usuario = require('../models/Usuario');
const Rol = require('../models/Rol');
const bcrypt = require('bcryptjs');

// Registrar un nuevo usuario
exports.register = async (req, res) => {
    const { usuario, contrasena, rol_id_rol } = req.body;

    try {
        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contrasena, salt);

        // Crear el nuevo usuario
        await Usuario.create({
            usuario,
            contrasena: hashedPassword,
            rol_id_rol,
            estado: 1 // 1 para activo
        });

        res.status(201).json({ message: "Usuario registrado exitosamente" });

    } catch (error) {
        console.error('❌ Error en register:', error);
        res.status(500).json({ 
            message: "Error al registrar el usuario", 
            error: error.message 
        });
    }
};

// Iniciar sesión
exports.login = async (req, res) => {
    const { usuario, contrasena } = req.body;

    try {
        const user = await Usuario.findOne({ where: { usuario: usuario } });
        if (!user) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        const isMatch = await bcrypt.compare(contrasena, user.contrasena);
        if (!isMatch) {
            return res.status(401).json({ message: "Usuario o contraseña incorrectos" });
        }

        // Crear la sesión del usuario
        req.session.user = {
            id: user.id_usuario,
            usuario: user.usuario,
            rolId: user.rol_id_rol
        };

        res.json({
            message: "Inicio de sesión exitoso",
            user: req.session.user
        });

    } catch (error) {
        console.error('❌ Error en login:', error);
        res.status(500).json({ 
            message: "Error en el servidor", 
            error: error.message 
        });
    }
};

// Cerrar sesión
exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('❌ Error en logout:', err);
            return res.status(500).json({ 
                message: "No se pudo cerrar la sesión.",
                error: err.message
            });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: "Sesión cerrada exitosamente." });
    });
};

// Obtener todos los roles activos
exports.getRoles = async (req, res) => {
    try {
        console.log('📋 Intentando obtener roles...');
        
        // Verificar que el modelo Rol existe
        if (!Rol) {
            throw new Error('Modelo Rol no está definido');
        }

        const roles = await Rol.findAll({ 
            where: { estado: 1 },
            attributes: ['id_rol', 'nombre', 'descripcion', 'estado']
        });
        
        console.log('✅ Roles obtenidos:', roles.length);
        
        // Asegurar headers CORS antes de enviar respuesta
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(roles);
        
    } catch (error) {
        console.error('❌ Error al obtener roles:', error);
        console.error('Stack:', error.stack);
        
        res.status(500).json({ 
            message: "Error al obtener roles",
            error: error.message,
            details: error.stack
        });
    }
};