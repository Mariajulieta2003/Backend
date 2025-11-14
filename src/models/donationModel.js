// backend/src/models/donationModel.js
import { pool } from "../config/db.js";

// Crear una donación
export async function createDonation({ user_id, amount, frequency, method, message }) {
  const [result] = await pool.execute(
    `INSERT INTO donations (user_id, amount, frequency, method, message)
     VALUES (?, ?, ?, ?, ?)`,
    [user_id || null, amount, frequency || "única", method || "desconocido", message || null]
  );

  const [rows] = await pool.execute(
    `SELECT d.*, u.name AS user_name, u.email AS user_email
       FROM donations d
       LEFT JOIN users u ON d.user_id = u.id
      WHERE d.id = ?`,
    [result.insertId]
  );

  return rows[0];
}

// Donaciones del usuario
export async function getDonationsByUser(user_id) {
  const [rows] = await pool.execute(
    `SELECT d.*, u.name AS user_name, u.email AS user_email
       FROM donations d
       LEFT JOIN users u ON d.user_id = u.id
      WHERE d.user_id = ?
      ORDER BY d.created_at DESC`,
    [user_id]
  );
  return rows;
}
