import { pool } from "../config/db.js";

// -----------------------------
// GET /users/me
// -----------------------------
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
    console.error("GET /users/me ERROR:", err);
    res.status(500).json({ message: "Error obteniendo perfil" });
  }
};

// -----------------------------
// PUT /users/me
// -----------------------------
export const updateMyProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      full_name,
      email,
      phone,
      bio,
      location,
      avatar_url,
      cover_url,
    } = req.body;

    // Validación rápida (el email no puede desaparecer)
    if (!email) {
      return res.status(400).json({ message: "El email es obligatorio" });
    }

    const [result] = await pool.query(
      `UPDATE users
       SET 
        full_name = ?,
        email = ?,
        phone = ?,
        bio = ?,
        location = ?,
        avatar_url = ?,
        cover_url = ?
       WHERE id = ?`,
      [
        full_name || null,
        email || null,
        phone || null,
        bio || null,
        location || null,
        avatar_url || null,
        cover_url || null,
        userId,
      ]
    );

    res.json({
      ok: true,
      message: "Perfil actualizado correctamente",
    });
  } catch (err) {
    console.error("PUT /users/me ERROR:", err);
    res.status(500).json({ message: "Error actualizando el perfil" });
  }
};
