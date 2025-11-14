// backend/src/controllers/userController.js
import { pool } from "../config/db.js";

export const getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT 
        id,
        full_name,
        email,
        phone,
        bio,
        location,
        avatar_url,
        cover_url,
        subscription_plan,
        subscription_price,
        subscription_at
      FROM users
      WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Error obteniendo perfil:", err);
    res.status(500).json({ message: "Error obteniendo perfil" });
  }
};

export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, phone, bio, location, avatar_url, cover_url } = req.body;

    await pool.query(
      `UPDATE users
       SET full_name=?, phone=?, bio=?, location=?, avatar_url=?, cover_url=?
       WHERE id=?`,
      [full_name, phone, bio, location, avatar_url, cover_url, userId]
    );

    res.json({ ok: true, message: "Perfil actualizado correctamente" });
  } catch (err) {
    console.error("Error actualizando perfil:", err);
    res.status(500).json({ message: "Error actualizando perfil" });
  }
};
