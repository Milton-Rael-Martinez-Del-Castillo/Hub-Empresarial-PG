const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Obtener todos los challenger
router.get('/challenger', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM challenger');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error leyendo challenger:', err.message);
    res.status(500).send('Error leyendo challenger');
  }
});

// Obtener un challenger por ID
router.get('/challenger/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM challenger WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).send('Challenger no encontrado');
    }
    res.json(rows[0]);
  } catch (err) {
    console.error('❌ Error obteniendo challenger:', err.message);
    res.status(500).send('Error obteniendo challenger');
  }
});

// Crear un nuevo challenger
router.post('/challenger', async (req, res) => {
  try {
    const { title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado } = req.body;
    const [result] = await pool.query(
      `INSERT INTO challenger (title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado || false]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    console.error('❌ Error creando challenger:', err.message);
    res.status(500).send('Error creando challenger');
  }
});

// Actualizar un challenger existente
router.put('/challenger/:id', async (req, res) => {
  try {
    const { title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado } = req.body;
    const [result] = await pool.query(
      `UPDATE challenger SET title = ?, image_url = ?, fecha = ?, hora_inicio = ?, hora_fin = ?, contacto_email = ?, destacado = ?
       WHERE id = ?`,
      [title, image_url, fecha, hora_inicio, hora_fin, contacto_email, destacado || false, req.params.id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).send('Challenger no encontrado');
    }
    res.json({ id: req.params.id, ...req.body });
  } catch (err) {
    console.error('❌ Error actualizando challenger:', err.message);
    res.status(500).send('Error actualizando challenger');
  }
});

// Eliminar un challenger
router.delete('/challenger/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM challenger WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).send('Challenger no encontrado');
    }
    res.status(204).send();
  } catch (err) {
    console.error('❌ Error eliminando challenger:', err.message);
    res.status(500).send('Error eliminando challenger');
  }
});

module.exports = router;
