const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.post('/proyectos', async (req, res) => {
  const { nombre_estudiante, semestre, carrera, contacto, nombre_proyecto, descripcion_proyecto, tipo_proyecto, requerimiento } = req.body;

  try {
    const connection = await pool.getConnection();
    await connection.execute(
      `INSERT INTO partners (nombre_estudiante, semestre, carrera, contacto, nombre_proyecto, descripcion_proyecto, tipo_proyecto, requerimiento)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre_estudiante, semestre, carrera, contacto, nombre_proyecto, descripcion_proyecto, tipo_proyecto, requerimiento]
    );
    connection.release();
    res.status(200).json({ message: 'Proyecto registrado exitosamente' });
  } catch (err) {
    res.status(500).json({ message: 'Error al guardar el proyecto' });
  }
});

module.exports = router;
