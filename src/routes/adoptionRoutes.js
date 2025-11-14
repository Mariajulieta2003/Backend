import express from "express";
import { requireAuth } from "../middlewares/authMiddleware.js";

import {
  createAdoptionRequest,
  getMyRequests,
  getReceivedRequests,
  updateAdoptionStatus,
  getAdoptionById,
} from "../controllers/adoptionController.js";

const router = express.Router();

router.post("/", requireAuth, createAdoptionRequest);
router.get("/my", requireAuth, getMyRequests);
router.get("/received", requireAuth, getReceivedRequests);
router.get("/:id", requireAuth, getAdoptionById);
router.put("/:id/status", requireAuth, updateAdoptionStatus);

export default router;
