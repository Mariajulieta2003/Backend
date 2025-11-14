// backend/src/app.js
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import "./config/db.js";

// Rutas
import authRoutes from "./routes/authRoutes.js";
import petRoutes from "./routes/petRoutes.js";
import adoptionRoutes from "./routes/adoptionRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import vetConsultRoutes from "./routes/vetConsultRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import volunteerRoutes from "./routes/volunteerRoutes.js";
import adoptionRequestRoutes from "./routes/adoptionRequestRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// 👇 IMPORTAMOS CONTROLADOR Y MIDDLEWARE PARA DEFINIR RUTAS DIRECTAS
import { getMyProfile, updateMyProfile } from "./controllers/userController.js";
import { authMiddleware } from "./middlewares/authMiddleware.js";


dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(morgan("dev"));

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// 🟢 Rutas con prefijo /api
app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/adoptions", adoptionRoutes);
app.use("/api/plans", planRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/support", supportRoutes);
app.use("/api/vet-consults", vetConsultRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/volunteers", volunteerRoutes);
app.use("/api/adoption-requests", adoptionRequestRoutes);

// ✅ RUTAS DE PERFIL DEFINIDAS DIRECTAMENTE AQUÍ
//    Estas son las IMPORTANTES para tu módulo "Mi Perfil"
app.get("/api/users/me", authMiddleware, getMyProfile);
app.put("/api/users/me", authMiddleware, updateMyProfile);

// ❌ Por ahora desactivamos el router general de users
//    porque probablemente ahí adentro hay algo que responde 404
//    y tapa nuestras rutas de /api/users/me
// app.use("/api/users", userRoutes);

// 🟢 Ping de prueba
app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

// 🟢 Middleware GLOBAL de errores
app.use((err, req, res, next) => {
  console.error("🔥 ERROR GLOBAL:", err);
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});

export default app;
