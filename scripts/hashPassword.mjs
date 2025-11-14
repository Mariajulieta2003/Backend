// scripts/hashPassword.mjs
import bcrypt from "bcryptjs";

const plain = "admin123"; // ← la contraseña que quieras

const hash = await bcrypt.hash(plain, 10);
console.log("Hash generado:\n", hash);
