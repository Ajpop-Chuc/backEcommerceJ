const { DataTypes } = require('sequelize');
const { sequelize } = require('../../database/config');

const Producto = sequelize.define('Producto', {
  id_producto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nombre: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  descripcion: {
    type: DataTypes.STRING(250),
    allowNull: false
  },
  precio_unitario: {
    type: DataTypes.DECIMAL(7, 2),
    allowNull: false
  },
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  // path o URL de la imagen del producto
    imagen_url: {
      type: DataTypes.STRING(255),
      allowNull: true             // se permite nulo si no se proporciona una imagen
    }
}, {
  tableName: 'producto',
  timestamps: false
});

module.exports = Producto;