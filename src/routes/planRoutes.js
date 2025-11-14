import { Router } from "express";
import { subscribeToPlan, getUserSubscription } from "../controllers/planController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/subscribe", authMiddleware, subscribeToPlan);
router.get("/my", authMiddleware, getUserSubscription);

export default router;
