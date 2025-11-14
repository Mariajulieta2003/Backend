import {
  insertVetConsult,
  selectUserVetConsults,
  selectVetQueue,
  updateStatus,
} from "../models/vetConsultModel.js";

export const createVetConsult = async (req, res) => {
  try {
    const {
      petId,
      hasPlan,
      planType,
      urgency,
      topic,
      detail,
      contactMode,
    } = req.body;

    const id = await insertVetConsult({
      user_id: req.user.id,
      pet_id: petId,
      plan: planType,
      urgency,
      reason: topic,
      symptoms: detail,
      contact_method: contactMode,
    });

    return res.json({ message: "Consulta creada", id });
  } catch (err) {
    return res.status(500).json({ message: "Error creando consulta", err });
  }
};

export const getMyVetConsults = async (req, res) => {
  try {
    const rows = await selectUserVetConsults(req.user.id);
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Error cargando historial", err });
  }
};

export const getVetConsultQueue = async (req, res) => {
  try {
    const rows = await selectVetQueue();
    return res.json(rows);
  } catch (err) {
    return res.status(500).json({ message: "Error cargando queue", err });
  }
};

export const updateVetConsultStatus = async (req, res) => {
  try {
    await updateStatus(req.params.id, req.body.status);
    return res.json({ message: "Estado actualizado" });
  } catch (err) {
    return res.status(500).json({ message: "Error actualizando estado", err });
  }
};
