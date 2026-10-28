const pool = require('../config/database');

// Registrar una solicitud UMA
const create = async ({ nombre, correo, mensaje }) => {
  const [result] = await pool.query(
    'INSERT INTO uma_solicitudes (nombre, correo, mensaje) VALUES (?, ?, ?)',
    [nombre, correo, mensaje || null]
  );
  return result.insertId;
};

// Obtener todas las solicitudes UMA
const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM uma_solicitudes ORDER BY created_at DESC'
  );
  return rows;
};

// Eliminar una solicitud UMA
const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM uma_solicitudes WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  remove
};