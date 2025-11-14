// src/models/volunteerModel.js
import { pool } from "../config/db.js";

export async function createVolunteerRequest({ user_id, message }) {
  const [result] = await pool.query(
    "INSERT INTO volunteer_requests (user_id, message) VALUES (?,?)",
    [user_id, message]
  );
  const [rows] = await pool.query(
    "SELECT * FROM volunteer_requests WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
}

export async function getVolunteerRequestByUser(user_id) {
  const [rows] = await pool.query(
    "SELECT * FROM volunteer_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
    [user_id]
  );
  return rows[0] || null;
}
