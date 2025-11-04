'use strict';
// Usamos 'Model' y 'DataTypes' de sequelize
import { Model, DataTypes } from 'sequelize';

// Exportamos una función que será llamada por 'models/index.js'
// 'sequelize' será pasado como argumento automáticamente.
export default (sequelize) => {
  
  // Definimos la clase del Modelo
  class Mascota extends Model {
    /**
     * Este método 'associate' es llamado por 'models/index.js'
     * para crear todas las relaciones DE UNA SOLA VEZ,
     * evitando errores de importación circular.
     */
    static associate(models) {
      
      // Relación: Una Mascota pertenece a un Usuario (quien la publicó)
      Mascota.belongsTo(models.Usuario, {
        foreignKey: 'usuarioId',
        as: 'Usuario' // Este alias es crucial para el controller
      });

      // Relación: Una Mascota pertenece a una Especie
      Mascota.belongsTo(models.Especie, {
        foreignKey: 'especieId',
        as: 'Especie' // <-- ¡ESTE ERA EL ERROR QUE VISTE!
      });

      // Relación: Una Mascota tiene muchas Patologías
      Mascota.hasMany(models.Patologia, {
        foreignKey: 'mascotaId',
        as: 'Patologias' // Este alias lo usará la página de detalle
      });

      // (Aquí puedes agregar más relaciones, ej: con SolicitudAdopcion)
    }
  }

  // Inicializamos el modelo con sus campos (columnas)
  Mascota.init({
    // No es necesario 'id', sequelize lo añade por defecto
    edad: DataTypes.INTEGER,
    compatibleNiños: DataTypes.BOOLEAN,
    compatibleMascotas: DataTypes.BOOLEAN,
    vacunas: DataTypes.TEXT,
    castrado: DataTypes.BOOLEAN,
    
    // Definimos las foreign keys que usamos en las asociaciones
    usuarioId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'usuarios', // nombre de la TABLA
        key: 'id'
      }
    },
    especieId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'especies', // nombre de la TABLA
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Mascota',
    tableName: 'mascotas', // Aseguramos que el nombre de la tabla sea 'mascotas'
    timestamps: false // Asumo que no usas createdAt/updatedAt
  });

  return Mascota;
};