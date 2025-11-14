// backend/src/models/vetConsultModel.js
import { pool } from "../config/db.js";

/**
 * Crea una nueva consulta veterinaria
 */
export async function createVetConsult({
  user_id,
  pet_id,
  has_plan,
  plan_type,
  urgency,
  topic,
  detail,
  contact_mode,
}) {
  const [result] = await pool.query(
    `INSERT INTO vet_consults 
      (user_id, pet_id, has_plan, plan_type, urgency, topic, detail, contact_mode, status, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())`,
    [
      user_id,
      pet_id || null,
      has_plan ? 1 : 0,
      plan_type || null,
      urgency,
      topic,
      detail,
      contact_mode,
    ]
  );

  return { id: result.insertId };
}

/**
 * Consultas de un usuario (historial)
 */
export async function getVetConsultsByUser(userId) {
  const [rows] = await pool.query(
    `SELECT vc.*, p.name AS pet_name
     FROM vet_consults vc
     LEFT JOIN pets p ON vc.pet_id = p.id
     WHERE vc.user_id = ?
     ORDER BY vc.created_at DESC`,
    [userId]
  );
  return rows;
}

/**
 * Cola de consultas para el equipo veterinario
 * (acá traemos todas; si más adelante querés, filtramos por veterinario)
 */
export async function getVetConsultsQueue() {
  const [rows] = await pool.query(
    `SELECT vc.*, u.name AS user_name, p.name AS pet_name
     FROM vet_consults vc
     LEFT JOIN users u ON vc.user_id = u.id
     LEFT JOIN pets p ON vc.pet_id = p.id
     ORDER BY 
       CASE vc.status 
         WHEN 'pending' THEN 0 
         WHEN 'in_progress' THEN 1 
         ELSE 2 
       END,
       vc.created_at DESC`
  );
  return rows;
}

/**
 * Actualiza el estado de una consulta
 */
export async function updateVetConsultStatus(id, status) {
  const [res] = await pool.query(
    `UPDATE vet_consults 
     SET status = ?, updated_at = NOW()
     WHERE id = ?`,
    [status, id]
  );
  return res.affectedRows > 0;
}
