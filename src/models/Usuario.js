const {DataTypes} = require('sequelize');
const {sequelize} = require('../../database/config');

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
    type: DataTypes.STRING(40),
    allowNull: false
    },
    estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
    },
    rol_id_rol: {
    type: DataTypes.INTEGER,
    foreignKey: true
    }
}, {
  tableName: 'usuario',
  timestamps: false
});
module.exports = Usuario;