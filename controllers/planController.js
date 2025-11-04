// backend/controllers/planController.js
import Plan from '../models/plan.js'; // (Asegúrate que la ruta al modelo sea correcta)

// Obtener todos los planes
export const getPlanes = async (req, res) => {
  try {
    const planes = await Plan.findAll();
    res.json(planes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un plan (Ejemplo básico, necesitará protección de admin)
export const createPlan = async (req, res) => {
  try {
    const nuevoPlan = await Plan.create(req.body);
    res.status(201).json(nuevoPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};