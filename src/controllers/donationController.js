// backend/src/controllers/donationController.js
import {
  createDonation,
  getDonationsByUser,
} from "../models/donationModel.js";

/**
 * POST /api/donations
 * Crear una donación
 */
export async function createDonationController(req, res) {
  try {
    const userId = req.user?.id || null; // puede ser null si permitís donaciones anónimas
    const { amount, frequency, method, message } = req.body;

    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ message: "El monto es requerido y debe ser mayor a 0." });
    }

    const donation = await createDonation({
      user_id: userId,
      amount: Number(amount),
      frequency,
      method,
      message,
    });

    res.status(201).json(donation);
  } catch (error) {
    console.error("Error createDonationController:", error);
    res.status(500).json({ message: "Error al registrar la donación" });
  }
}

/**
 * GET /api/donations/my
 * Donaciones realizadas por el usuario logueado
 */
export async function getMyDonationsController(req, res) {
  try {
    const userId = req.user.id;
    const rows = await getDonationsByUser(userId);
    res.json(rows);
  } catch (error) {
    console.error("Error getMyDonationsController:", error);
    res.status(500).json({ message: "Error al obtener tus donaciones" });
  }
}
