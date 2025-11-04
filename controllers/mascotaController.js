import Mascota from '../models/mascota.js';
import Usuario from '../models/usuario.js';
import Especie from '../models/especie.js';
import path from 'path';

// Crear mascota (con o sin foto)
export const createMascota = async (req, res) => {
  try {
    const { nombre, edad, descripcion, especieId, usuarioId } = req.body;

    // Si hay archivo subido, guardamos la ruta relativa
    const foto = req.file ? `/uploads/${req.file.filename}` : null;

    const nuevaMascota = await Mascota.create({
      nombre,
      edad,
      descripcion,
      especieId,
      usuarioId,
      foto
    });

    res.status(201).json({ mensaje: 'Mascota creada', mascota: nuevaMascota });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: 'Error al crear la mascota' });
  }
};

// Obtener todas las mascotas
export const getMascotas = async (req, res) => {
  try {
    const mascotas = await Mascota.findAll({
      include: [Usuario, Especie]
    });
    res.json(mascotas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener mascota por ID
export const getMascotaById = async (req, res) => {
  try {
    const mascota = await Mascota.findByPk(req.params.id, {
      include: [Usuario, Especie]
    });
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(mascota);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar mascota
export const updateMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findByPk(req.params.id);
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });

    // Si suben nueva foto, reemplazar
    if (req.file) {
      req.body.foto = `/uploads/${req.file.filename}`;
    }

    await mascota.update(req.body);
    res.json({ mensaje: 'Mascota actualizada', mascota });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar mascota
export const deleteMascota = async (req, res) => {
  try {
    const mascota = await Mascota.findByPk(req.params.id);
    if (!mascota) return res.status(404).json({ error: 'Mascota no encontrada' });
    await mascota.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

