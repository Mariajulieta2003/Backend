// src/controllers/profileController.js
import { getUserById, updateUserProfile } from "../models/userModel.js";

export async function getProfile(req, res) {
  try {
    const user = await getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({
      id: user.id,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      created_at: user.created_at,
    });
  } catch (err) {
    console.error("Error getProfile:", err);
    res.status(500).json({ message: "Error al obtener perfil" });
  }
}

export async function updateProfile(req, res) {
  try {
    const { full_name } = req.body;
    const data = {};
    if (full_name) data.full_name = full_name;

    const updated = await updateUserProfile(req.user.id, data);
    res.json({
      id: updated.id,
      full_name: updated.full_name,
      email: updated.email,
      role: updated.role,
    });
  } catch (err) {
    console.error("Error updateProfile:", err);
    res.status(500).json({ message: "Error al actualizar perfil" });
  }
}
