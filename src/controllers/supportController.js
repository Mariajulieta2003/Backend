// backend/src/controllers/supportController.js
import {
  createSupportTicket,
  getSupportTicketsByUser,
  getAllSupportTickets,
  updateSupportTicketStatus,
} from "../models/supportModel.js";

/**
 * Obtener ID del usuario autenticado
 * (Adaptalo según tu auth real)
 */
function getUserIdFromReq(req) {
  if (req.user?.id) return req.user.id;
  return 1; // fallback temporal para testear
}

/**
 * Crear un ticket de soporte
 * POST /api/support
 */
export async function supportCreate(req, res) {
  try {
    const userId = getUserIdFromReq(req);
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res
        .status(400)
        .json({ error: "Debés indicar un asunto y un mensaje." });
    }

    const ticket = await createSupportTicket({
      userId,
      subject,
      message,
    });

    return res.status(201).json(ticket);
  } catch (err) {
    console.error("❌ Error creando ticket:", err);
    return res.status(500).json({
      error: "Error al crear la solicitud de soporte.",
    });
  }
}

/**
 * Obtener tickets del usuario
 * GET /api/support/my
 */
export async function supportGetMy(req, res) {
  try {
    const userId = getUserIdFromReq(req);

    const tickets = await getSupportTicketsByUser(userId);
    return res.json(tickets);
  } catch (err) {
    console.error("❌ Error obteniendo tickets del usuario:", err);
    return res.status(500).json({
      error: "No se pudieron obtener tus tickets.",
    });
  }
}

/**
 * Obtener todos los tickets (admin / soporte)
 * GET /api/support/incoming
 */
export async function supportGetIncoming(req, res) {
  try {
    const tickets = await getAllSupportTickets();
    return res.json(tickets);
  } catch (err) {
    console.error("❌ Error obteniendo tickets de soporte:", err);
    return res.status(500).json({
      error: "Error al obtener las solicitudes de soporte.",
    });
  }
}

/**
 * Actualizar estado de ticket
 * PATCH /api/support/:id/status
 */
export async function supportUpdateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body; // abierto | en_progreso | cerrado

    if (!status) {
      return res.status(400).json({
        error: "Debés enviar un estado válido.",
      });
    }

    const updated = await updateSupportTicketStatus(id, status);

    if (!updated) {
      return res.status(404).json({
        error: "Ticket no encontrado.",
      });
    }

    return res.json(updated);
  } catch (err) {
    console.error("❌ Error actualizando ticket:", err);
    return res.status(500).json({
      error: "No se pudo actualizar el estado del ticket.",
    });
  }
}
