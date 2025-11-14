// backend/src/models/petModel.js
import mongoose from "mongoose";

// Esquema de mascota (ajustá campos si querés, pero así ya funciona)
const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String, // "Perro", "Gato", "Otro"
      default: "Otro",
    },
    sex: {
      type: String, // "Macho", "Hembra"
    },
    size: {
      type: String, // "Pequeño", "Mediano", "Grande"
    },
    age: {
      type: String, // texto libre: "3 meses", "2 años"
    },
    energy: {
      type: String, // "Tranquilo", "Activo", etc.
    },
    vaccinated: {
      type: Boolean,
      default: false,
    },
    neutered: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      trim: true,
    },
    requirements: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String, // URL de la imagen
      },
    ],
    city: String,
    state: String,
    province: String,

    lat: Number,
    lng: Number,

    // dueñ@ de la publicación
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Export nombrado para usar con: import { Pet } from "../models/petModel.js";
export const Pet = mongoose.model("Pet", petSchema);
