// backend/src/routes/petRoutes.js
import { Router } from "express";
import {
  getAllPets,
  getMyPets,
  getPetById,
  createPet,
  updatePetStatus,
  updatePet,
  deletePet,
} from "../controllers/petController.js";

const router = Router();

router.get("/mine", getMyPets);                 
router.patch("/:id/status", updatePetStatus);   // PATCH estado
router.put("/:id", updatePet);                  // PUT editar mascota
router.get("/:id", getPetById);                 // detalle
router.delete("/:id", deletePet);               // borrar
router.post("/", createPet);                    // crear nueva
router.get("/", getAllPets);                    // listado general


export default router;
