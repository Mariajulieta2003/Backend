// backend/src/routes/userRoutes.js
import { Router } from "express";
import {
  getMyProfile,
  updateMyProfile,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

/**
 * GET /api/users/me
 * Devuelve los datos del usuario logueado
 */
router.get("/me", authMiddleware, getMyProfile);

/**
 * PUT /api/users/me
 * Actualiza los datos del usuario logueado
 */
router.put("/me", authMiddleware, updateMyProfile);

export default router;
