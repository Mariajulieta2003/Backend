import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User } from "../models/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body; // 👈 CORREGIDO

    if (!email || !password) {
      return res.status(400).json({ message: "Email y contraseña son obligatorios" });
    }

    // Buscar usuario por email (o mail)
    const user = await User.findOne({ where: { mail: email } }); // 👈 CORREGIDO

    if (!user) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // Payload completo, INCLUYENDO ROLE ✔
    const payload = {
      id: user.id,
      full_name: user.full_name,
      email: user.mail,
      role: user.role, // 👈 ES CLAVE PARA EL NAVBAR
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

    return res.json({
      token,
      user: payload,
    });

  } catch (err) {
    console.error("Error en login:", err);
    return res.status(500).json({ message: "Error en el servidor" });
  }
}
