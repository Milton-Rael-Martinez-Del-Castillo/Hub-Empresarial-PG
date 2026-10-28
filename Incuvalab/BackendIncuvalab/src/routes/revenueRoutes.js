const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// Insertar un nuevo registro en revenue
router.post('/revenue', async (req, res) => {
  const { nombre, contacto, institucion, descripcion } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO revenue (nombre, nro_contacto, nombre_proyecto_institucion, descripcion_apoyo)
       VALUES (?, ?, ?, ?)`,
      [nombre, contacto, institucion, descripcion]
    );
    connection.release();
    res.status(200).json({ message: 'Datos de contacto guardados exitosamente' });
  } catch (err) {
    console.error('❌ Error al insertar en revenue:', err.message);
    res.status(500).json({ message: 'Hubo un problema al guardar los datos en revenue.' });
  }
});

module.exports = router;
