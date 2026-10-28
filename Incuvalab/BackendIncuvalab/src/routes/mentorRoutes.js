const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Obtener todos los mentores

router.get('/mentor', async (req, res) => {

  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query(`
      SELECT id, image_url, nombre, telefono, area_experiencia, disponibilidad
      FROM mentor
    `);
    connection.release();
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Error al obtener mentores:', err);
    res.status(500).json({ message: 'Hubo un problema al obtener los mentores.' });
  }
});

// Crear nuevo mentor

router.post('/mentor', async (req, res) => {

  try {
    const { nombre, telefono, area_experiencia, disponibilidad, image_url } = req.body;
    const connection = await pool.getConnection();
    const [result] = await connection.execute(
      'INSERT INTO mentor (usuario_id, nombre, telefono, area_experiencia, disponibilidad, image_url) VALUES (1, ?, ?, ?, ?, ?)',
      [nombre, telefono, area_experiencia, disponibilidad, image_url]
    );
    connection.release();
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error('❌ Error al crear mentor:', err);
    res.status(500).json({ message: 'Hubo un problema al crear el mentor.' });
  }
});


router.put('/mentor/:id', async (req, res) => {

  try {
    const { id } = req.params;
    const { nombre, telefono, area_experiencia, disponibilidad, image_url } = req.body;
    const connection = await pool.getConnection();
    await connection.execute(
      'UPDATE mentor SET nombre = ?, telefono = ?, area_experiencia = ?, disponibilidad = ?, image_url = ? WHERE id = ?',
      [nombre, telefono, area_experiencia, disponibilidad, image_url, id]
    );
    connection.release();
    res.status(200).json({ message: 'Mentor actualizado correctamente' });
  } catch (err) {
    console.error('❌ Error al actualizar mentor:', err);
    res.status(500).json({ message: 'Hubo un problema al actualizar el mentor.' });
  }
});

// Eliminar mentor

router.delete('/mentor/:id', async (req, res) => {


  try {
    const { id } = req.params;
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM mentor WHERE id = ?', [id]);
    connection.release();
    res.status(200).json({ message: 'Mentor eliminado correctamente' });
  } catch (err) {
    console.error('❌ Error al eliminar mentor:', err);
    res.status(500).json({ message: 'Hubo un problema al eliminar el mentor.' });
  }
});

module.exports = router;
