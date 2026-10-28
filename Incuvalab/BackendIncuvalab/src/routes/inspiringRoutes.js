const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Obtener todos los registros
router.get('/inspiring', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM inspiring');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error leyendo inspiring:', err.message);
    res.status(500).send('Error leyendo inspiring');
  }
});

// Crear un nuevo registro
router.post('/inspiring', async (req, res) => {
  const { titulo, speaker, descripcion, imagen_url, video_url, contacto_email } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO inspiring (titulo, speaker, descripcion, imagen_url, video_url, contacto_email, fecha_creacion) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [titulo, speaker, descripcion, imagen_url, video_url, contacto_email]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('❌ Error creando inspiring:', err.message);
    res.status(500).send('Error creando inspiring');
  }
});

// Actualizar un registro existente
router.put('/inspiring/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, speaker, descripcion, imagen_url, video_url, contacto_email } = req.body;
  try {
    await pool.query(
      'UPDATE inspiring SET titulo = ?, speaker = ?, descripcion = ?, imagen_url = ?, video_url = ?, contacto_email = ? WHERE id = ?',
      [titulo, speaker, descripcion, imagen_url, video_url, contacto_email, id]
    );
    res.status(200).json({ message: 'Inspiring actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error actualizando inspiring:', err.message);
    res.status(500).send('Error actualizando inspiring');
  }
});

// Eliminar un registro
router.delete('/inspiring/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM inspiring WHERE id = ?', [id]);
    res.status(200).json({ message: 'Inspiring eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error eliminando inspiring:', err.message);
    res.status(500).send('Error eliminando inspiring');
  }
});

module.exports = router;
