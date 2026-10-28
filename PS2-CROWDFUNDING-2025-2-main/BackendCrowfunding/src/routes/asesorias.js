import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET: Listar todas las asesorías
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Asesoria ORDER BY Nombre ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener asesorías" });
  }
});

// POST: Crear nueva asesoría
router.post("/", async (req, res) => {
  const { Nombre } = req.body;
  if (!Nombre || !Nombre.trim()) 
    return res.status(400).json({ error: "Nombre es obligatorio" });

  try {
    const [result] = await pool.query(
      "INSERT INTO Asesoria (Nombre) VALUES (?)", 
      [Nombre.trim()]
    );
    res.json({ id: result.insertId, Nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear asesoría" });
  }
});

// PUT: Editar asesoría
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Nombre } = req.body;
  if (!Nombre || !Nombre.trim()) 
    return res.status(400).json({ error: "Nombre es obligatorio" });

  try {
    await pool.query("UPDATE Asesoria SET Nombre = ? WHERE IdAsesoria = ?", [Nombre.trim(), id]);
    res.json({ id, Nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar asesoría" });
  }
});

// DELETE: Eliminar asesoría
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM Asesoria WHERE IdAsesoria = ?", [id]);
    res.json({ message: "Asesoría eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar asesoría" });
  }
});

export default router;