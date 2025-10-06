const {DataTypes} = require('sequelize');
const {sequelize} = require('../../database/config');

const HistorialCambio = sequelize.define('HistorialCambios', {
  id_historial_cambios: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
    },
    cambio: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fecha_HORA: {
      type: DataTypes.DATE,
      allowNull: false
    },
    usuario_id_usuario: {
      type: DataTypes.INTEGER,
      foreignKey: true
    }
  },
  {
    tableName: 'historial_cambios',
    timestamps: false
  }
);

module.exports = HistorialCambio;
