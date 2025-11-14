// backend/src/routes/supportRoutes.js
import { Router } from "express";
import {
  createSupportTicket,
  getSupportTicketsByUser,
  getAllSupportTickets,
  updateSupportTicketStatus,
} from "../models/supportModel.js";

const router = Router();

/**
 * Helper para obtener el userId
 * (ajustalo a tu middleware de auth real)
 */
function getUserIdFromReq(req) {
  // Ejemplo: si guardás el usuario en req.user
  if (req.user && req.user.id) return req.user.id;

  // Por ahora, fallback de prueba
  return 1;
}

/**
 * POST /api/support
 * Crear ticket de soporte (usuario)
 */
router.post("/", async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res
        .status(400)
        .json({ error: "Debés indicar asunto y mensaje." });
    }

    const ticket = await createSupportTicket({ userId, subject, message });
    res.status(201).json(ticket);
  } catch (err) {
    console.error("Error creando ticket soporte:", err);
    res.status(500).json({ error: "Error al crear el ticket de soporte" });
  }
});

/**
 * GET /api/support/my
 * Tickets del usuario actual
 */
router.get("/my", async (req, res) => {
  try {
    const userId = getUserIdFromReq(req);
    const tickets = await getSupportTicketsByUser(userId);
    res.json(tickets);
  } catch (err) {
    console.error("Error obteniendo tickets del usuario:", err);
    res
      .status(500)
      .json({ error: "Error al obtener los tickets del usuario" });
  }
});

/**
 * GET /api/support/incoming
 * Tickets recibidos (panel de soporte / admin)
 */
router.get("/incoming", async (_req, res) => {
  try {
    const tickets = await getAllSupportTickets();
    res.json(tickets);
  } catch (err) {
    console.error("Error obteniendo tickets:", err);
    res
      .status(500)
      .json({ error: "Error al obtener los tickets de soporte" });
  }
});

/**
 * PATCH /api/support/:id/status
 * Cambiar estado de un ticket
 */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // "abierto" | "en_progreso" | "cerrado"

    if (!status) {
      return res
        .status(400)
        .json({ error: "Debés indicar un estado válido." });
    }

    const updated = await updateSupportTicketStatus(id, status);
    if (!updated) {
      return res.status(404).json({ error: "Ticket no encontrado." });
    }

    res.json(updated);
  } catch (err) {
    console.error("Error actualizando estado ticket:", err);
    res
      .status(500)
      .json({ error: "Error al actualizar el estado del ticket" });
  }
});

export default router;
