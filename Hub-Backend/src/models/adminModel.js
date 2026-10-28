const pool = require('../config/database');

// Buscar un administrador por correo
const findAdminByCorreo = async (correo) => {
  const [rows] = await pool.query(
    'SELECT * FROM admin_usuario WHERE correo = ?',
    [correo]
  );
  return rows[0] || null;
};

// Insertar un nuevo administrador del Hub
const insertAdmin = async ({ nombre, correo, contrasena, rol }) => {
  const [result] = await pool.query(
    'INSERT INTO admin_usuario (nombre, correo, contrasena, rol) VALUES (?, ?, ?, ?)',
    [nombre, correo, contrasena, rol]
  );
  return result.insertId;
};

module.exports = {
  findAdminByCorreo,
  insertAdmin
};