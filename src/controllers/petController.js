// backend/src/controllers/petController.js
import { pool } from "../config/db.js";

// 👉 Normaliza una fila de MySQL al formato que usa el front
const mapPetRow = (row) => ({
  id: row.id,
  name: row.name,
  category:
    row.species === "perro"
      ? "Perro"
      : row.species === "gato"
      ? "Gato"
      : "Otro",
  size:
    row.size === "pequeño"
      ? "Pequeño"
      : row.size === "mediano"
      ? "Mediano"
      : row.size === "grande"
      ? "Grande"
      : row.size,
  sex:
    row.sex === "macho"
      ? "Macho"
      : row.sex === "hembra"
      ? "Hembra"
      : "Otro",
  ageYears: row.age_years ?? 0,
  ageMonths: row.age_months ?? 0,
  age: `${row.age_years ?? 0} años ${row.age_months ?? 0} meses`,
  city: row.location || "",
  vaccinated: !!row.is_vaccinated,
  neutered: !!row.is_neutered,
  goodWithKids: !!row.good_with_kids,
  goodWithPets: !!row.good_with_pets,
  status: row.status,
  description: row.description || "",
  photoURL: row.image_url || "",
});

// ------------------------------------------------------------
// 🛠 Función auxiliar para normalizar payload (POST y PUT)
// ------------------------------------------------------------
const normalizePetBody = (body, existingImage = null) => {
  const name = body.name || body.petName;
  const ownerId = body.ownerId || body.owner_id || 1;

  const category = body.category || body.species || "Perro";
  const size = body.size || "mediano";
  const sex = body.sex || "macho";

  const ageYears = body.ageYears ?? body.age_years ?? 0;
  const ageMonths = body.ageMonths ?? body.age_months ?? 0;

  const location =
    body.city && body.province
      ? `${body.city}, ${body.province}`
      : body.location || null;

  const isVaccinated = !!(
    body.vaccinated ??
    body.isVaccinated ??
    body.is_vaccinated
  );
  const isNeutered = !!(
    body.neutered ??
    body.isNeutered ??
    body.is_neutered
  );
  const goodWithKids = !!(
    body.goodWithKids ??
    body.withKids ??
    body.good_with_kids
  );
  const goodWithPets = !!(
    body.goodWithPets ??
    body.withPets ??
    body.good_with_pets ??
    body.goodWithDogs ??
    body.goodWithCats
  );

  const status = body.status || "en_adopcion";
  const description = body.description || null;

  // ------------------------------------------------------------
  // 📸 MANEJO DE IMAGENES BASE64 CONSISTENTE
  // ------------------------------------------------------------
  let imageUrl = null;

  // Caso A: si vienen photos (base64 desde PublishPet)
  if (Array.isArray(body.photos) && body.photos.length > 0) {
    const img0 = body.photos[0];
    if (typeof img0 === "string") imageUrl = img0;
  }

  // Caso B: si vienen images
  if (!imageUrl && Array.isArray(body.images) && body.images.length > 0) {
    const img0 = body.images[0];
    if (typeof img0 === "string") imageUrl = img0;
  }

  // Caso C: si viene imageUrl directo
  if (!imageUrl && body.imageUrl) imageUrl = body.imageUrl;

  // Caso D: si viene image_url (DB)
  if (!imageUrl && body.image_url) imageUrl = body.image_url;

  // Caso E: si no se envía NADA, conservar la anterior
  if (!imageUrl && existingImage) imageUrl = existingImage;

  return {
    ownerId,
    name,
    category,
    size,
    sex,
    ageYears,
    ageMonths,
    location,
    isVaccinated,
    isNeutered,
    goodWithKids,
    goodWithPets,
    status,
    description,
    imageUrl,
  };
};

// ------------------------------------------------------------
// 🟢 Mascotas en adopción (listado general)
// ------------------------------------------------------------
export const getAllPets = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM pets WHERE status = 'en_adopcion'"
    );
    res.json(rows.map(mapPetRow));
  } catch (err) {
    console.error("Error getAllPets:", err);
    res.status(500).json({ message: "Error obteniendo mascotas" });
  }
};

// ------------------------------------------------------------
// 🟢 Mis mascotas publicadas
// ------------------------------------------------------------
export const getMyPets = async (req, res) => {
  try {
    const ownerId = req.query.ownerId || req.user?.id || 1;
    const [rows] = await pool.query(
      "SELECT * FROM pets WHERE owner_id = ? ORDER BY created_at DESC",
      [ownerId]
    );
    res.json(rows.map(mapPetRow));
  } catch (err) {
    console.error("Error getMyPets:", err);
    res.status(500).json({ message: "Error obteniendo mis mascotas" });
  }
};

// ------------------------------------------------------------
// 🟢 Detalle de mascota
// ------------------------------------------------------------
export const getPetById = async (req, res) => {
  try {
    const petId = req.params.id;
    const [rows] = await pool.query("SELECT * FROM pets WHERE id = ?", [
      petId,
    ]);

    if (!rows.length)
      return res.status(404).json({ message: "Mascota no encontrada" });

    res.json(mapPetRow(rows[0]));
  } catch (err) {
    console.error("Error getPetById:", err);
    res.status(500).json({ message: "Error obteniendo la mascota" });
  }
};

// ------------------------------------------------------------
// 🟢 Crear mascota (POST)
// ------------------------------------------------------------
export const createPet = async (req, res) => {
  try {
    const data = normalizePetBody(req.body);

    const [result] = await pool.query(
      `INSERT INTO pets 
        (owner_id, name, species, size, sex, age_years, age_months, location,
         is_vaccinated, is_neutered, good_with_kids, good_with_pets,
         status, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.ownerId,
        data.name,
        data.category.toLowerCase(),
        data.size.toLowerCase(),
        data.sex.toLowerCase(),
        data.ageYears,
        data.ageMonths,
        data.location,
        data.isVaccinated ? 1 : 0,
        data.isNeutered ? 1 : 0,
        data.goodWithKids ? 1 : 0,
        data.goodWithPets ? 1 : 0,
        data.status,
        data.description,
        data.imageUrl,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM pets WHERE id = ?", [
      result.insertId,
    ]);

    res.status(201).json(mapPetRow(rows[0]));
  } catch (err) {
    console.error("Error createPet:", err);
    res.status(500).json({ message: "Error creando mascota" });
  }
};

// ------------------------------------------------------------
// 🟢 Editar mascota (PUT)
// ------------------------------------------------------------
export const updatePet = async (req, res) => {
  try {
    const petId = req.params.id;

    // obtener datos actuales (para conservar imagen si no se cambia)
    const [existingRows] = await pool.query(
      "SELECT image_url FROM pets WHERE id = ?",
      [petId]
    );
    if (!existingRows.length)
      return res.status(404).json({ message: "Mascota no encontrada" });

    const existingImg = existingRows[0].image_url;

    const data = normalizePetBody(req.body, existingImg);

    const [result] = await pool.query(
      `UPDATE pets SET
        name = ?, species = ?, size = ?, sex = ?, 
        age_years = ?, age_months = ?, location = ?, 
        is_vaccinated = ?, is_neutered = ?, 
        good_with_kids = ?, good_with_pets = ?, 
        description = ?, image_url = ?
      WHERE id = ?`,
      [
        data.name,
        data.category.toLowerCase(),
        data.size.toLowerCase(),
        data.sex.toLowerCase(),
        data.ageYears,
        data.ageMonths,
        data.location,
        data.isVaccinated ? 1 : 0,
        data.isNeutered ? 1 : 0,
        data.goodWithKids ? 1 : 0,
        data.goodWithPets ? 1 : 0,
        data.description,
        data.imageUrl,
        petId,
      ]
    );

    const [rows] = await pool.query("SELECT * FROM pets WHERE id = ?", [
      petId,
    ]);

    res.json(mapPetRow(rows[0]));
  } catch (err) {
    console.error("Error updatePet:", err);
    res.status(500).json({ message: "Error actualizando mascota" });
  }
};

// ------------------------------------------------------------
// 🟢 Cambiar estado
// ------------------------------------------------------------
export const updatePetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const mapToDb = {
      published: "en_adopcion",
      paused: "pausada",
      finished: "finalizada",
      draft: "borrador",
    };

    const dbStatus = mapToDb[status];
    if (!dbStatus)
      return res.status(400).json({ message: "Estado inválido" });

    await pool.query("UPDATE pets SET status = ? WHERE id = ?", [
      dbStatus,
      id,
    ]);

    const [rows] = await pool.query("SELECT * FROM pets WHERE id = ?", [
      id,
    ]);

    res.json(mapPetRow(rows[0]));
  } catch (err) {
    console.error("Error updatePetStatus:", err);
    res.status(500).json({ message: "Error al actualizar estado" });
  }
};

// ------------------------------------------------------------
// 🟢 Eliminar publicación
// ------------------------------------------------------------
export const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query("DELETE FROM pets WHERE id = ?", [id]);

    if (!result.affectedRows)
      return res.status(404).json({ message: "Mascota no encontrada" });

    res.status(204).send();
  } catch (err) {
    console.error("Error deletePet:", err);
    res.status(500).json({ message: "Error eliminando mascota" });
  }
};
