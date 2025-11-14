// src/models/subscriptionModel.js
import { pool } from "../config/db.js";

export async function createSubscription({
  user_id,
  plan_id,
  start_date,
  end_date,
}) {
  const [result] = await pool.query(
    "INSERT INTO user_subscriptions (user_id, plan_id, start_date, end_date, status) VALUES (?,?,?,?, 'activa')",
    [user_id, plan_id, start_date, end_date]
  );
  const [rows] = await pool.query(
    "SELECT * FROM user_subscriptions WHERE id = ?",
    [result.insertId]
  );
  return rows[0];
}

export async function getActiveSubscriptionByUser(user_id) {
  const [rows] = await pool.query(
    `SELECT us.*, vp.name AS plan_name, vp.price
     FROM user_subscriptions us
     JOIN vet_plans vp ON us.plan_id = vp.id
     WHERE us.user_id = ? AND us.status = 'activa' AND us.end_date >= CURDATE()
     ORDER BY us.end_date DESC
     LIMIT 1`,
    [user_id]
  );
  return rows[0] || null;
}
