const {DataTypes} = require('sequelize');
const {sequelize} = require('../../database/config');

const Sucursal = sequelize.define('Sucursal', {
  id_sucursal: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true},
  nombre: {
    type: DataTypes.STRING(250),
    allowNull: false},
  direccion: {
    type: DataTypes.STRING(250),
    allowNull: false},
  telefono: {
    type: DataTypes.STRING(10),
    allowNull: false},
  estado: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true}
}, {
  tableName: 'sucursal',
  timestamps: false
});

module.exports = Sucursal;