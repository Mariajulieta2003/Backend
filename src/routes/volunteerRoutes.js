// src/routes/volunteerRoutes.js
import express from "express";
import {
  createVolunteer,
  myVolunteerStatus,
} from "../controllers/volunteerController.js";
import { authMiddleware, requireRole } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  requireRole(["user", "vet"]),
  createVolunteer
);

router.get(
  "/my",
  authMiddleware,
  requireRole(["user", "vet"]),
  myVolunteerStatus
);

export default router;
