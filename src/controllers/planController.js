// backend/src/controllers/planController.js
import { pool } from "../config/db.js";

/**
 * POST /api/plans/subscribe
 * Body: { plan_id }
 *
 * Lógica:
 *  - Verifica que exista el plan en vet_plans
 *  - Cierra suscripciones activas anteriores del usuario (status = 'activa' → 'inactiva')
 *  - Crea una nueva fila en user_subscriptions con status = 'activa'
 *  - Devuelve la última suscripción activa
 */
export const subscribeToPlan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { plan_id } = req.body;

    if (!plan_id) {
      return res.status(400).json({ message: "Falta plan_id" });
    }

    // 1) Verificar que el plan exista
    const [planRows] = await pool.query(
      "SELECT id, name, price FROM vet_plans WHERE id = ?",
      [plan_id]
    );

    if (planRows.length === 0) {
      return res.status(404).json({ message: "Plan no encontrado" });
    }

    const plan = planRows[0];

    // 2) Opcional: marcar suscripciones anteriores como inactivas
    await pool.query(
      `UPDATE user_subscriptions 
       SET status = 'inactiva'
       WHERE user_id = ? AND status = 'activa'`,
      [userId]
    );

    // 3) Crear nueva suscripción activa
    await pool.query(
      `INSERT INTO user_subscriptions (user_id, plan_id, status, start_date)
       VALUES (?, ?, 'activa', NOW())`,
      [userId, plan.id]
    );

    // 4) Volver a obtener la suscripción activa (última)
    const [rows] = await pool.query(
      `SELECT s.*, p.name AS plan_name, p.price 
         FROM user_subscriptions s
         JOIN vet_plans p ON s.plan_id = p.id
         WHERE s.user_id = ? AND s.status = 'activa'
         ORDER BY s.start_date DESC
         LIMIT 1`,
      [userId]
    );

    return res.json({
      ok: true,
      message: "Suscripción realizada correctamente",
      subscription: rows[0] || null,
    });
  } catch (e) {
    console.error("Error en subscribeToPlan:", e);
    res.status(500).json({ message: "Error al suscribirse al plan" });
  }
};

/**
 * GET /api/plans/my
 * Devuelve la suscripción activa actual del usuario
 */
export const getUserSubscription = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT s.*, p.name AS plan_name, p.price 
         FROM user_subscriptions s
         JOIN vet_plans p ON s.plan_id = p.id
         WHERE s.user_id = ? AND s.status = 'activa'
         ORDER BY s.start_date DESC
         LIMIT 1`,
      [userId]
    );

    if (rows.length === 0) {
      return res.json({ subscription: null });
    }

    res.json({ subscription: rows[0] });
  } catch (e) {
    console.error("Error al obtener suscripción:", e);
    res.status(500).json({ message: "Error al obtener suscripción" });
  }
};
