const {DataTypes} = require('sequelize');
const {sequelize} = require('../../database/config');

const PermisoAcceso = sequelize.define('PermisoAcceso', {
  id_permiso_acceso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  estado: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  rol_id_rol: {
    type: DataTypes.INTEGER,
    foreignKey: true
  }
}, {
  tableName: 'permiso_acceso',
  timestamps: false
});

module.exports = PermisoAcceso;
