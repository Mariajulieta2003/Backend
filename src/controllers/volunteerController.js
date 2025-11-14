// src/controllers/volunteerController.js
import {
  createVolunteerRequest,
  getVolunteerRequestByUser,
} from "../models/volunteerModel.js";

export async function createVolunteer(req, res) {
  try {
    const { message } = req.body;
    if (!message) {
      return res
        .status(400)
        .json({ message: "El mensaje de voluntariado es obligatorio" });
    }

    const existing = await getVolunteerRequestByUser(req.user.id);
    if (existing) {
      return res.status(400).json({
        message: "Ya enviaste una postulación. Podés esperar respuesta.",
        request: existing,
      });
    }

    const request = await createVolunteerRequest({
      user_id: req.user.id,
      message,
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Error createVolunteer:", err);
    res.status(500).json({ message: "Error al enviar postulación" });
  }
}

export async function myVolunteerStatus(req, res) {
  try {
    const request = await getVolunteerRequestByUser(req.user.id);
    res.json(request || null);
  } catch (err) {
    console.error("Error myVolunteerStatus:", err);
    res.status(500).json({ message: "Error al obtener estado" });
  }
}
