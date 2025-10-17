const { Sequelize } = require('../../database/config');

// Importar modelos
const Producto = require('./Producto');
const Sucursal = require('./Sucursal');
const SucursalProducto = require('./sucursalProducto');
const Rol = require('./Rol');
const PermisoAcceso = require('./permisoAcceso');
const HistorialCambio = require('./historialCambio');
const Usuario = require('./Usuario');
// ... otros modelos

// Definir asociaciones aquí (si las hay)
// Producto.belongsToMany(Sucursal, { through: SucursalProducto, foreignKey: 'producto_id_producto' });
// Sucursal.belongsToMany(Producto, { through: SucursalProducto, foreignKey: 'sucursal_id_sucursal' });
Producto.hasMany(SucursalProducto, { foreignKey: 'producto_id_producto' });
SucursalProducto.belongsTo(Producto, { foreignKey: 'producto_id_producto' });
Sucursal.hasMany(SucursalProducto, { foreignKey: 'sucursal_id_sucursal' });
SucursalProducto.belongsTo(Sucursal, { foreignKey: 'sucursal_id_sucursal' });

// Función para inicializar modelos y asociaciones
//Esto compara tus modelos con las tablas de la BD e iguala los modelos a las tablas si es necesario
// const initModels = async () => {
//   try {
//     // Sincronizar modelos con la BD
//     await sequelize.sync({ force: false }); // force: true solo en desarrollo
//     console.log('Modelos sincronizados con la base de datos');
//   } catch (error) {
//     console.error('Error sincronizando modelos:', error);
//   }
// };


//Asociación de Usuario-Rol 
// Un usuario pertenece a un rol
Usuario.belongsTo(Rol, { foreignKey: 'rol_id_rol' });
// Un rol puede tener muchos usuarios
Rol.hasMany(Usuario, { foreignKey: 'rol_id_rol' });

module.exports = {
  Sequelize,
  Producto,
  Sucursal,
  SucursalProducto,
  Rol,
  PermisoAcceso,
  HistorialCambio,
  Usuario,
  //initModels
};