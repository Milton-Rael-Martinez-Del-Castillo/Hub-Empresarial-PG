const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Obtener todos los servicios
router.get('/empresas_servicios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM empresas_servicios');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error leyendo servicios:', err.message);
    res.status(500).send('Error leyendo servicios');
  }
});

// Obtener un servicio por ID
router.get('/empresas_servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM empresas_servicios WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send('Servicio no encontrado');
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error obteniendo servicio:', err.message);
    res.status(500).send('Error obteniendo servicio');
  }
});

// Crear un nuevo servicio
router.post('/empresas_servicios', async (req, res) => {
  const { imagen_url, titulo, descripcion, subtitulo, servicios } = req.body;
  try {
    const [result] = await pool.query(
      `INSERT INTO empresas_servicios (imagen_url, titulo, descripcion, subtitulo, servicios)
       VALUES (?, ?, ?, ?, ?)`,
      [imagen_url, titulo, descripcion, subtitulo, servicios]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('❌ Error creando servicio:', err.message);
    res.status(500).send('Error creando servicio');
  }
});

// Actualizar servicio
router.put('/empresas_servicios/:id', async (req, res) => {
  const { id } = req.params;
  const { imagen_url, titulo, descripcion, subtitulo, servicios } = req.body;
  try {
    await pool.query(
      `UPDATE empresas_servicios
       SET imagen_url = ?, titulo = ?, descripcion = ?, subtitulo = ?, servicios = ?
       WHERE id = ?`,
      [imagen_url, titulo, descripcion, subtitulo, servicios, id]
    );
    res.status(200).json({ message: 'Servicio actualizado' });
  } catch (err) {
    console.error('❌ Error actualizando servicio:', err.message);
    res.status(500).send('Error actualizando servicio');
  }
});

// Eliminar servicio
router.delete('/empresas_servicios/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM empresas_servicios WHERE id = ?', [id]);
    res.status(200).json({ message: 'Servicio eliminado' });
  } catch (err) {
    console.error('❌ Error eliminando servicio:', err.message);
    res.status(500).send('Error eliminando servicio');
  }
});

module.exports = router;
