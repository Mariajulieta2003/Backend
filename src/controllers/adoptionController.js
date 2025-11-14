// backend/src/controllers/adoptionController.js
import { pool } from "../config/db.js";

// Crear solicitud de adopción
export const createAdoptionRequest = async (req, res) => {
  try {
    const adopterId = req.user.id;
    const { pet_id, message } = req.body;

    const [result] = await pool.query(
      `INSERT INTO adoption_requests (pet_id, adopter_id, message, status, created_at)
       VALUES (?, ?, ?, 'pendiente', NOW())`,
      [pet_id, adopterId, message || ""]
    );

    res.json({
      message: "Solicitud enviada correctamente",
      request_id: result.insertId,
    });
  } catch (error) {
    console.error("Error creando solicitud:", error);
    res.status(500).json({ message: "Error creando solicitud" });
  }
};

// Solicitudes que YO envié
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT ar.*, p.name AS pet_name
       FROM adoption_requests ar
       JOIN pets p ON ar.pet_id = p.id
       WHERE ar.adopter_id = ?
       ORDER BY ar.created_at DESC`,
      [userId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo mis solicitudes:", error);
    res.status(500).json({ message: "Error obteniendo solicitudes" });
  }
};

// ❗❗ ESTE FALTABA - Solicitudes RECIBIDAS (dueño de la mascota)
export const getReceivedRequests = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [rows] = await pool.query(
      `SELECT ar.*, 
              p.name AS pet_name,
              u.full_name AS adopter_name,
              u.email AS adopter_email
       FROM adoption_requests ar
       JOIN pets p ON ar.pet_id = p.id
       JOIN users u ON ar.adopter_id = u.id
       WHERE p.owner_id = ?
       ORDER BY ar.created_at DESC`,
      [ownerId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error obteniendo solicitudes recibidas:", error);
    res.status(500).json({ message: "Error obteniendo solicitudes recibidas" });
  }
};

// Cambiar estado (aceptar / rechazar)
export const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["aceptada", "rechazada", "pendiente"].includes(status)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    await pool.query(
      `UPDATE adoption_requests SET status = ? WHERE id = ?`,
      [status, id]
    );

    res.json({ message: "Estado actualizado" });
  } catch (error) {
    console.error("Error actualizando estado:", error);
    res.status(500).json({ message: "Error actualizando estado" });
  }
};

// Obtener una solicitud por ID
export const getAdoptionById = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `SELECT ar.*, p.name AS pet_name, u.full_name AS adopter_name
       FROM adoption_requests ar
       JOIN pets p ON p.id = ar.pet_id
       JOIN users u ON u.id = ar.adopter_id
       WHERE ar.id = ?`,
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Solicitud no encontrada" });

    res.json(rows[0]);
  } catch (error) {
    console.error("Error obteniendo solicitud:", error);
    res.status(500).json({ message: "Error obteniendo solicitud" });
  }
};

