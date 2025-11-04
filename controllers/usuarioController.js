// backend/controllers/usuarioController.js
import Usuario from '../models/usuario.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Tu clave secreta para JWT (pon esto en un .env en un proyecto real)
const JWT_SECRET = 'tu-secreto-muy-secreto-123';

// Crear usuario (Registro)
export const createUsuario = async (req, res) => {
  try {
    // Hashear la contraseña antes de crearla
    const { password, ...userData } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const nuevoUsuario = await Usuario.create({
      ...userData,
      password: hashedPassword // Guardamos la contraseña hasheada
    });

    // No devuelvas la contraseña
    nuevoUsuario.password = undefined; 
    res.status(201).json(nuevoUsuario);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  // ... tu función getUsuarios (sin cambios) ...
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] } // Nunca devuelvas contraseñas
    });
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener usuario por ID
export const getUsuarioById = async (req, res) => {
  // ... tu función getUsuarioById (sin cambios) ...
   try {
    const usuario = await Usuario.findByPk(req.params.id, {
      attributes: { exclude: ['password'] } // Nunca devuelvas contraseñas
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar usuario
export const updateUsuario = async (req, res) => {
  // ... tu función updateUsuario (sin cambios) ...
  // (Nota: si actualizas la contraseña, también deberías hashearla)
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    // Si se está actualizando la contraseña, hashearla
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    await usuario.update(req.body);
    usuario.password = undefined; // No devolver la contraseña
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar usuario
export const deleteUsuario = async (req, res) => {
  // ... tu función deleteUsuario (sin cambios) ...
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    await usuario.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 


// --- ¡NUEVA FUNCIÓN DE LOGIN AÑADIDA! ---

export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Buscar al usuario por email
    const usuario = await Usuario.findOne({ where: { email: email } });
    if (!usuario) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // 2. Comparar la contraseña
    const esPasswordCorrecto = await bcrypt.compare(password, usuario.password);
    if (!esPasswordCorrecto) {
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    }

    // 3. Si todo es correcto, crear un Token (JWT)
    const payload = {
      id: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '1h' // El token expira en 1 hora
    });

    // 4. Enviar el token al cliente
    res.json({
      message: 'Login exitoso',
      token: token
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};