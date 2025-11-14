import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createAdoptionRequest,
  getIncomingRequests,
  getMyRequests
} from "../controllers/adoptionRequestController.js";

const router = Router();

// Crear solicitud
router.post("/", authMiddleware, createAdoptionRequest);

// Solicitudes recibidas (dueño de la mascota)
router.get("/incoming", authMiddleware, getIncomingRequests);

// Mis solicitudes
router.get("/mine", authMiddleware, getMyRequests);

export default router;
