// backend/routes/planRoutes.js
import express from 'express';
import {
  getPlanes,
  createPlan
} from '../controllers/planController.js';

const router = express.Router();

router.get('/', getPlanes);
router.post('/', createPlan);
// (Puedes añadir GET /:id, PUT /:id, DELETE /:id aquí)

export default router;