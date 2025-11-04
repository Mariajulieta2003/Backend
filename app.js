import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors'; // <--- 1. IMPORTAMOS CORS
import path from 'path';
import { fileURLToPath } from 'url';
import { sequelize } from './models/index.js';

import usuarioRoutes from './routes/usuarioRoutes.js';
import mascotaRoutes from './routes/mascotaRoutes.js';
import solicitudRoutes from './routes/solicitudAdopcionRoutes.js';
import especieRoutes from './routes/especieRoutes.js';
import patologiaRoutes from './routes/patologiaRoutes.js';
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import planRoutes from './routes/planRoutes.js';
import './config/database.js'; // Asegúrate de que la configuración de la base de datos se cargue


const app = express();

app.use(cors());
// Necesario para __dirname con ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware para parsear JSON
app.use(express.json());
app.use('/mascotas', mascotaRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/veterinarios', veterinarioRoutes);
app.use('/planes', planRoutes);

// Hacer pública la carpeta de uploads (para servir imágenes)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- 3. RUTAS DE LA API (Corregidas con el prefijo /api) ---
// Ahora las rutas coinciden con tu apiclient.js
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/mascotas', mascotaRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/especies', especieRoutes);
app.use('/api/patologias', patologiaRoutes);
app.use('/api/veterinarios', veterinarioRoutes);
// ---------------------------------------------------------

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
  });
}).catch(error => {
  console.error('Error al sincronizar la base de datos:', error);
});

export default app;