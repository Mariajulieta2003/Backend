import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

// ---- Obtiene el token desde el header Authorization ----
function getTokenFromHeader(req) {
  const auth =
    req.headers.authorization || req.headers.Authorization || "";

  if (!auth) return null;

  // Soporta "Bearer xxx" o solo "xxx"
  if (auth.startsWith("Bearer ")) {
    return auth.slice(7).trim();
  }
  return auth.trim();
}

// ---- Middleware base: verifica token y adjunta req.user ----
export function authMiddleware(req, res, next) {
  const token = getTokenFromHeader(req);

  if (!token) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Guardamos los datos del usuario en la request
    req.user = {
      id: decoded.id,
      role: decoded.role,
      ...decoded,
    };

    next();
  } catch (error) {
    console.error("Error JWT:", error.message);
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
}

// Alias por compatibilidad
export function requireAuth(req, res, next) {
  return authMiddleware(req, res, next);
}

// ---- Middleware de rol: requireRole(["user", "vet"]) ----
export function requireRole(roles = []) {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return function (req, res, next) {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "No autenticado. Falta usuario en la request." });
    }

    if (!allowed.length) {
      return next(); // si no pasás roles, no restringe nada
    }

    if (!allowed.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "No tenés permisos para esta acción." });
    }

    next();
  };
}

// Default export, por si lo importan sin llaves
export default authMiddleware;
