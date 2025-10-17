const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/config');

const ProductoTransaccion = sequelize.define('ProductoTransaccion', {
  id_producto_transaccion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_producto: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cantidad: {    
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_origen: {    
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_destino: {    
    type: DataTypes.INTEGER,
    allowNull: false
  },
  fecha: {    
    type: DataTypes.DATE,
    allowNull: false    
  },
  hora:{
    type: DataTypes.TIME,
    allowNull: false      
  }
}, {
  tableName: 'transacciones_productos',
  timestamps: false
});

module.exports = ProductoTransaccion;
