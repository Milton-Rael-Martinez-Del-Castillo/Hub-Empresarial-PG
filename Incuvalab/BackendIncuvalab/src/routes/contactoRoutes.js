
const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.post('/contacto', async (req, res) => {
  const { nombre, email, telefono, tipo_consulta, mensaje } = req.body;
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO contactos (envio_formulario, nombres, correo, telefono, seleccion, mensaje_enviado)
       VALUES (NOW(), ?, ?, ?, ?, ?)`,
      [nombre, email, telefono, tipo_consulta, mensaje]
    );
    connection.release();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// New GET route for admin
router.get('/contacto', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      `SELECT id, envio_formulario, nombres, correo, telefono, seleccion, mensaje_enviado 
       FROM contactos 
       ORDER BY envio_formulario DESC`
    );
    connection.release();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// New DELETE route for admin
router.delete('/contacto/:id', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    await connection.execute(
      `DELETE FROM contactos WHERE id = ?`,
      [req.params.id]
    );
    connection.release();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
