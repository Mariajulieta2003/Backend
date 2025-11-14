// backend/src/controllers/vetConsultController.js
import {
  createVetConsult,
  getVetConsultsByUser,
  getVetConsultsQueue,
  updateVetConsultStatus,
} from "../models/vetConsultModel.js";

/**
 * POST /api/vet-consults
 * Crear una nueva consulta veterinaria
 */
export async function createConsult(req, res) {
  try {
    const userId = req.user.id;

    const {
      petId,
      hasPlan,
      planType,
      urgency,
      topic,
      detail,
      contactMode,
    } = req.body;

    if (!topic || !detail) {
      return res
        .status(400)
        .json({ message: "Motivo y detalle de la consulta son obligatorios." });
    }

    const allowedUrgency = ["baja", "media", "alta"];
    if (!allowedUrgency.includes(urgency)) {
      return res.status(400).json({ message: "Nivel de urgencia inválido." });
    }

    const allowedContact = ["chat", "video"];
    if (!allowedContact.includes(contactMode)) {
      return res.status(400).json({ message: "Modo de contacto inválido." });
    }

    const { id } = await createVetConsult({
      user_id: userId,
      pet_id: petId || null,
      has_plan: !!hasPlan,
      plan_type: hasPlan ? planType || null : null,
      urgency,
      topic,
      detail,
      contact_mode: contactMode,
    });

    res.status(201).json({
      id,
      message: "Consulta enviada correctamente.",
    });
  } catch (error) {
    console.error("Error createConsult:", error);
    res.status(500).json({ message: "Error al crear la consulta." });
  }
}

/**
 * GET /api/vet-consults/my
 * Historial de consultas del usuario logueado
 */
export async function getMyConsults(req, res) {
  try {
    const userId = req.user.id;
    const rows = await getVetConsultsByUser(userId);
    res.json(rows);
  } catch (error) {
    console.error("Error getMyConsults:", error);
    res.status(500).json({ message: "Error al obtener tus consultas." });
  }
}

/**
 * GET /api/vet-consults/queue
 * Cola de consultas para el equipo veterinario
 */
export async function getQueue(req, res) {
  try {
    const rows = await getVetConsultsQueue();
    res.json(rows);
  } catch (error) {
    console.error("Error getQueue:", error);
    res.status(500).json({ message: "Error al obtener la cola de consultas." });
  }
}

/**
 * PATCH /api/vet-consults/:id/status
 * Cambiar estado de una consulta (pending / in_progress / done / canceled)
 */
export async function changeStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowed = ["pending", "in_progress", "done", "canceled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Estado inválido." });
    }

    const ok = await updateVetConsultStatus(id, status);
    if (!ok) {
      return res.status(404).json({ message: "Consulta no encontrada." });
    }

    res.json({ message: "Estado actualizado correctamente." });
  } catch (error) {
    console.error("Error changeStatus:", error);
    res.status(500).json({ message: "Error al actualizar el estado." });
  }
}
