// backend/routes/usuarioRoutes.js
import express from 'express';
import {
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario,
  loginUsuario // <-- ¡Importa la nueva función!
} from '../controllers/usuarioController.js';

const router = express.Router();

// --- Rutas de Autenticación ---
router.post('/', createUsuario); // Esta es tu ruta de "Registro"
router.post('/login', loginUsuario); // <-- ¡Añade esta ruta para "Login"!

// --- Rutas CRUD Estándar ---
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;