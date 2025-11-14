// backend/src/models/supportModel.js
import { pool } from "../config/db.js";

/**
 * Crear un nuevo ticket de soporte
 */
export async function createSupportTicket({ userId, subject, message }) {
  const query = `
    INSERT INTO support_tickets (user_id, subject, message)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, subject, message];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

/**
 * Tickets del usuario logueado
 */
export async function getSupportTicketsByUser(userId) {
  const query = `
    SELECT *
    FROM support_tickets
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows;
}

/**
 * Tickets recibidos (para admin / soporte)
 */
export async function getAllSupportTickets() {
  const query = `
    SELECT *
    FROM support_tickets
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

/**
 * Actualizar estado de un ticket
 */
export async function updateSupportTicketStatus(id, status) {
  const query = `
    UPDATE support_tickets
    SET status = $2,
        updated_at = NOW()
    WHERE id = $1
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [id, status]);
  return rows[0];
}
