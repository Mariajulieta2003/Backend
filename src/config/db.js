// backend/src/config/db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "peluditos_home",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Logueamos una prueba de conexión al iniciar
(async () => {
  try {
    const conn = await pool.getConnection();
    await conn.ping();
    console.log("✅ Conectado a MySQL (peluditos_home)");
    conn.release();
  } catch (err) {
    console.error("❌ Error conectando a MySQL:", err.message);
  }
})();
