// backend/src/routes/donationRoutes.js
import { Router } from "express";
import {
  createDonationController,
  getMyDonationsController,
} from "../controllers/donationController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const router = Router();

// Crear donación (usuario logueado)
router.post("/", requireAuth, createDonationController);

// Mis donaciones
router.get("/my", requireAuth, getMyDonationsController);

export default router;
