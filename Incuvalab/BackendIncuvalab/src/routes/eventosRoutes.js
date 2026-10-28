// backend/src/routes/eventos.routes.js
const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// GET todos los eventos
router.get('/eventos', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT * FROM eventos ORDER BY fecha_evento, hora');
    connection.release();
    res.json(rows);
  } catch (err) {
    console.error('Error al obtener eventos:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los eventos',
      error: err.message,
    });
  }
});

// POST crear evento
router.post('/eventos', async (req, res) => {
  const { titulo, descripcion, fecha_evento, hora, lugar, administrador_id } = req.body;

  if (!titulo || !fecha_evento || !lugar) {
    return res.status(400).json({
      message: 'Faltan campos requeridos: título, fecha_evento y lugar son obligatorios',
    });
  }

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO eventos (titulo, descripcion, fecha_evento, hora, lugar) VALUES (?, ?, ?, ?, ?)',
      [titulo, descripcion || null, fecha_evento, hora || null, lugar || null]
    );
    connection.release();

    res.status(201).json({
      success: true,
      id: result.insertId,
      ...req.body,
    });
  } catch (err) {
    console.error('Error al crear evento:', err);
    res.status(500).json({
      success: false,
      message: 'Error al crear el evento',
      error: err.message,
    });
  }
});

// PUT actualizar evento
router.put('/eventos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, fecha_evento, hora, lugar } = req.body;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      `UPDATE eventos 
       SET titulo = ?, descripcion = ?, fecha_evento = ?, hora = ?, lugar = ?
       WHERE id = ?`,
      [titulo, descripcion, fecha_evento, hora, lugar, id]
    );
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json({ message: 'Evento actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar evento:', err);
    res.status(500).json({ message: 'Error al actualizar el evento' });
  }
});

// DELETE eliminar evento
router.delete('/eventos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const connection = await pool.getConnection();
    const [result] = await connection.execute('DELETE FROM eventos WHERE id = ?', [id]);
    connection.release();

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Evento no encontrado' });
    }

    res.json({ message: 'Evento eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar evento:', err);
    res.status(500).json({ message: 'Error al eliminar el evento' });
  }
});

module.exports = router;
