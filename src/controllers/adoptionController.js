import { pool } from "../config/db.js";

//
// 📌 Crear solicitud de adopción
//
export const createAdoptionRequest = async (req, res) => {
  try {
    const adopterId = req.user.id;
    const { pet_id, message } = req.body;

    const [result] = await pool.query(
      `INSERT INTO adoption_requests (pet_id, user_id, status, message, created_at)
       VALUES (?, ?, 'pendiente', ?, NOW())`,
      [pet_id, adopterId, message || ""]
    );

    res.json({
      ok: true,
      message: "Solicitud enviada correctamente",
      request_id: result.insertId,
    });
  } catch (err) {
    console.error("Error creating adoption request:", err);
    res.status(500).json({ message: "Error creando solicitud" });
  }
};

//
// 📌 Mis solicitudes (yo soy el adoptante)
//
export const getMyRequests = async (req, res) => {
  try {
    const myId = req.user.id;

    const [rows] = await pool.query(
      `SELECT ar.id, ar.status, ar.message, ar.created_at,
              p.name AS pet_name, p.photoURL AS pet_photo
       FROM adoption_requests ar
       JOIN pets p ON ar.pet_id = p.id
       WHERE ar.user_id = ?
       ORDER BY ar.created_at DESC`,
      [myId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error getting my requests:", err);
    res.status(500).json({ message: "Error obteniendo solicitudes" });
  }
};

//
// 📌 Solicitudes recibidas (yo soy el dueño de la mascota)
//
export const getReceivedRequests = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [rows] = await pool.query(
      `SELECT ar.id, ar.status, ar.message, ar.created_at,
              p.name AS pet_name, p.photoURL AS pet_photo,
              u.full_name AS adopter_name,
              u.email AS adopter_email,
              u.phone AS adopter_phone
       FROM adoption_requests ar
       JOIN pets p ON ar.pet_id = p.id
       JOIN users u ON ar.user_id = u.id
       WHERE p.owner_id = ?
       ORDER BY ar.created_at DESC`,
      [ownerId]
    );

    res.json(rows);
  } catch (err) {
    console.error("Error getting received requests:", err);
    res.status(500).json({ message: "Error obteniendo solicitudes recibidas" });
  }
};

//
// 📌 Cambiar estado (aceptada / rechazada)
//
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["pendiente", "aceptada", "rechazada"].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    await pool.query(
      `UPDATE adoption_requests SET status = ? WHERE id = ?`,
      [status, id]
    );

    res.json({ ok: true, message: "Estado actualizado" });
  } catch (err) {
    console.error("Error updating status:", err);
    res.status(500).json({ message: "Error actualizando estado" });
  }
};

//
// 📌 Obtener una solicitud por ID
//
export const getAdoptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT ar.*, p.name AS pet_name, u.full_name AS adopter_name
       FROM adoption_requests ar
       JOIN pets p ON p.id = ar.pet_id
       JOIN users u ON u.id = ar.user_id
       WHERE ar.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "No encontrada" });

    res.json(rows[0]);
  } catch (err) {
    console.error("Error getting adoption request:", err);
    res.status(500).json({ message: "Error obteniendo solicitud" });
  }
};
