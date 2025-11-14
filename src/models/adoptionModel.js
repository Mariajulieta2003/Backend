// backend/src/models/adoptionModel.js
import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",  // ajustá si tu modelo de usuario tiene otro nombre
      required: false,
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pendiente", "aceptada", "rechazada"],
      default: "pendiente",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

// Export nombrado
export const Adoption = mongoose.model("Adoption", adoptionSchema);
