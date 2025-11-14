import { pool } from "../config/db.js";

// POST /api/adoption-requests → crear solicitud
export async function createAdoptionRequest(req, res) {
  try {
    const applicant_id = req.user.id; // viene del token
    const { pet_id, message } = req.body;

    if (!pet_id) return res.status(400).json({ message: "Falta pet_id" });

    // Verificar que la mascota exista
    const [pets] = await pool.query(
      "SELECT * FROM pets WHERE id = ?",
      [pet_id]
    );

    if (pets.length === 0) {
      return res.status(404).json({ message: "Mascota no encontrada" });
    }

    // Crear solicitud
    const [result] = await pool.query(
      "INSERT INTO adoption_requests (pet_id, user_id, message) VALUES (?, ?, ?)",
      [pet_id, applicant_id, message]
    );

    return res.json({
      id: result.insertId,
      pet_id,
      user_id: applicant_id,
      message,
      status: "pendiente",
    });

  } catch (error) {
    console.error("❌ ERROR createAdoptionRequest:", error);
    return res.status(500).json({ message: "Error al crear solicitud" });
  }
}

// GET /api/adoption-requests/incoming → solicitudes recibidas (dueño)
export async function getIncomingRequests(req, res) {
  try {
    const owner_id = req.user.id;

    // Obtener todas las mascotas del dueño
    const [pets] = await pool.query(
      "SELECT id, name FROM pets WHERE owner_id = ?",
      [owner_id]
    );

    if (pets.length === 0) return res.json([]);

    const petIds = pets.map(p => p.id);

    // Obtener solicitudes de esas mascotas
    const [requests] = await pool.query(
      `SELECT ar.*, p.name AS pet_name, u.full_name AS applicant_name 
       FROM adoption_requests ar
       JOIN pets p ON p.id = ar.pet_id
       JOIN users u ON u.id = ar.user_id
       WHERE ar.pet_id IN (${petIds.map(() => "?").join(",")})`,
      petIds
    );

    return res.json(requests);

  } catch (error) {
    console.error("❌ ERROR getIncomingRequests:", error);
    return res.status(500).json({ message: "Error al obtener solicitudes" });
  }
}

// GET /api/adoption-requests/mine → solicitudes hechas por el usuario
export async function getMyRequests(req, res) {
  try {
    const user_id = req.user.id;

    const [requests] = await pool.query(
      `SELECT ar.*, p.name AS pet_name 
       FROM adoption_requests ar
       JOIN pets p ON p.id = ar.pet_id
       WHERE ar.user_id = ?`,
      [user_id]
    );

    return res.json(requests);

  } catch (error) {
    console.error("❌ ERROR getMyRequests:", error);
    return res.status(500).json({ message: "Error al obtener mis solicitudes" });
  }
}
