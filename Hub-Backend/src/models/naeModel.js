const pool = require('../config/database');

// Registrar una solicitud de asesoria NAE
const create = async ({ nombre, correo }) => {
  const [result] = await pool.query(
    'INSERT INTO nae_solicitudes (nombre, correo) VALUES (?, ?)',
    [nombre, correo]
  );
  return result.insertId;
};

// Obtener todas las solicitudes NAE
const getAll = async () => {
  const [rows] = await pool.query(
    'SELECT * FROM nae_solicitudes ORDER BY created_at DESC'
  );
  return rows;
};

// Eliminar una solicitud NAE
const remove = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM nae_solicitudes WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

// ─── Casos de exito NAE (carrusel editable) ───

// Obtener todos los casos de exito
const getCases = async () => {
  const [rows] = await pool.query(
    'SELECT id, titulo, descripcion, imagen_url, orden, created_at, updated_at FROM nae_casos_exito ORDER BY orden ASC, id ASC'
  );
  return rows;
};

// Crear un caso de exito
const createCase = async ({ titulo, descripcion, imagen_url, orden }) => {
  const [result] = await pool.query(
    'INSERT INTO nae_casos_exito (titulo, descripcion, imagen_url, orden) VALUES (?, ?, ?, ?)',
    [titulo, descripcion, imagen_url || null, orden || 0]
  );
  return result.insertId;
};

// Actualizar un caso de exito
const updateCase = async (id, { titulo, descripcion, imagen_url, orden }) => {
  const [result] = await pool.query(
    'UPDATE nae_casos_exito SET titulo = ?, descripcion = ?, imagen_url = ?, orden = ? WHERE id = ?',
    [titulo, descripcion, imagen_url || null, orden || 0, id]
  );
  return result.affectedRows > 0;
};

// Eliminar un caso de exito
const removeCase = async (id) => {
  const [result] = await pool.query(
    'DELETE FROM nae_casos_exito WHERE id = ?',
    [id]
  );
  return result.affectedRows > 0;
};

module.exports = {
  create,
  getAll,
  remove,
  getCases,
  createCase,
  updateCase,
  removeCase
};