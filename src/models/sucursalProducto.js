const {DataTypes} = require('sequelize');
const {sequelize} = require('../../database/config');

const SucursalProducto = sequelize.define('SucursalProducto', {
  id_sucursal_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
    sucursal_id_sucursal: {
    type: DataTypes.INTEGER,
    foreignKey: true
  },
  producto_id_producto: {
    type: DataTypes.INTEGER,
    foreignKey: true
  },
  cantidad_disponible: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'sucursal_producto',
  timestamps: false
});

module.exports = SucursalProducto;