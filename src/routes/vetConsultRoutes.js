import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createVetConsult,
  getMyVetConsults,
  getVetConsultQueue,
  updateVetConsultStatus,
} from "../controllers/vetConsultController.js";

const router = express.Router();

// Crear consulta veterinaria
router.post("/", authMiddleware, createVetConsult);

// Historial del usuario
router.get("/mine", authMiddleware, getMyVetConsults);

// Cola del veterinario
router.get("/queue", authMiddleware, getVetConsultQueue);

// Actualizar estado
router.put("/:id/status", authMiddleware, updateVetConsultStatus);

export default router;
