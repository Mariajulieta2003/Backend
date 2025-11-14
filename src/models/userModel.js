// src/models/userModel.js
import { pool } from "../config/db.js";

export async function createUser({ full_name, email, password_hash, role }) {
  const [result] = await pool.query(
    "INSERT INTO users (full_name, email, password_hash, role) VALUES (?,?,?,?)",
    [full_name, email, password_hash, role || "user"]
  );
  return { id: result.insertId, full_name, email, role: role || "user" };
}

export async function getUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0] || null;
}

export async function getUserById(id) {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  return rows[0] || null;
}

export async function updateUserProfile(id, data) {
  await db.query("UPDATE users SET ? WHERE id = ?", [data, id]);
  return getUserById(id);
}
