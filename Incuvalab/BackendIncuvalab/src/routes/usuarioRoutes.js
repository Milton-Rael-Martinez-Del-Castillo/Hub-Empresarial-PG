const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const router = express.Router();

const VALID_ROLES = ['Emprendedor', 'Estudiante', 'Institución'];

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const PASSWORD_REQUIREMENTS = [
  { test: (p) => p.length >= 8, message: 'mínimo 8 caracteres' },
  { test: (p) => /[A-Z]/.test(p), message: 'una mayúscula' },
  { test: (p) => /[a-z]/.test(p), message: 'una minúscula' },
  { test: (p) => /[0-9]/.test(p), message: 'un número' },
  { test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p), message: 'un carácter especial' }
];

function validatePassword(password) {
  return PASSWORD_REQUIREMENTS
    .filter(({ test }) => !test(password))
    .map(({ message }) => message);
}

// Crear usuario
router.post('/usuario', async (req, res) => {
  const { email, password, rol } = req.body;

  if (!email || !password || !rol) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  if (typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    return res.status(400).json({ message: 'Por favor ingresa un correo electrónico válido' });
  }

  if (typeof password !== 'string') {
    return res.status(400).json({ message: 'La contraseña no es válida' });
  }

  const missingRequirements = validatePassword(password);
  if (missingRequirements.length > 0) {
    return res.status(400).json({ message: `La contraseña debe contener: ${missingRequirements.join(', ')}` });
  }

  if (!VALID_ROLES.includes(rol)) {
    return res.status(400).json({ message: 'El rol seleccionado no es válido' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await pool.getConnection();
    await connection.execute(
      'INSERT INTO usuario (usuario, contrasena, rol) VALUES (?, ?, ?)',
      [email, hashedPassword, rol]
    );
    connection.release();
    res.status(200).json({ message: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('Error al insertar en usuario:', err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'El correo ya se encuentra registrado' });
    }
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});

module.exports = router;