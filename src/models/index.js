const { sequelize } = require('../../database/config');

// Importar modelos
const Producto = require('./Producto');
// ... otros modelos

// Definir asociaciones aquí (si las hay)
// Ejemplo: Producto.belongsToMany(Sucursal, { through: 'sucursal_producto' });

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

module.exports = {
  sequelize,
  Producto,
  //initModels
};