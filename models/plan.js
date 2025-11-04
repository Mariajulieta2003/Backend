// backend/models/plan.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js'; // (Asegúrate que la ruta a tu config de sequelize sea correcta)

const Plan = sequelize.define('Plan', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descripcion: {
    type: DataTypes.TEXT,
  },
  precio: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  // Opciones del modelo
});

export default Plan;