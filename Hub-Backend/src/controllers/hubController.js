const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const adminModel = require('../models/adminModel');

// Inicio de sesion del administrador (JWT)
const login = async (req, res) => {
  const email = req.body.email || req.body.correo;
  const { password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Correo y contraseña son obligatorios' });
  }

  try {
    const user = await adminModel.findAdminByCorreo(email);

    if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const isMatch = await bcrypt.compare(password, user.contrasena);

    if (!isMatch) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign(
      { id: user.id, nombre: user.nombre, correo: user.correo, rol: user.rol },
      config.jwtSecret,
      { expiresIn: '100y' }
    );

    res.json({
      user: { id: user.id, nombre: user.nombre, email: user.correo, rol: user.rol },
      token
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error en login' });
  }
};

// Verificacion de sesion activa
const verifyAuth = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ isAuthenticated: false });

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    res.json({
      isAuthenticated: true,
      user: { id: decoded.id, nombre: decoded.nombre, email: decoded.correo, rol: decoded.rol }
    });
  } catch {
    res.json({ isAuthenticated: false });
  }
};

module.exports = {
  login,
  verifyAuth
};