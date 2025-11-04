import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createMascota,
  getMascotas,
  getMascotaById,
  updateMascota,
  deleteMascota
} from '../controllers/mascotaController.js';

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // carpeta donde se guardarán las fotos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Crear mascota con foto
router.post('/', upload.single('foto'), createMascota);

// Obtener todas las mascotas
router.get('/', getMascotas);

// Obtener mascota por ID
router.get('/:id', getMascotaById);

// Actualizar mascota con posible foto
