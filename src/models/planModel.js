// src/models/planModel.js
import { pool } from "../config/db.js";

export async function getAllPlans() {
  const [rows] = await pool.query("SELECT * FROM vet_plans ORDER BY price ASC");
  return rows;
}

export async function getPlanById(id) {
  const [rows] = await pool.query("SELECT * FROM vet_plans WHERE id = ?", [id]);
  return rows[0] || null;
}
