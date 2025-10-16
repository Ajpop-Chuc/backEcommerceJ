const {DataTypes} = require('sequelize');
const {sequelize} = require('../../database/config');
// importar Rol si es necesario para asociaciones
const Rol = require('./Rol');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    usuario: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
    },
    contrasena: {
    type: DataTypes.STRING,
    allowNull: false
    },
    estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
    },
    rol_id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: Rol,
          key: 'id_rol'
      }
  }
}, {
  tableName: 'usuario',
  timestamps: false
});

module.exports = Usuario;