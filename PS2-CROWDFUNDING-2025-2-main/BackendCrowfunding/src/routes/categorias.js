import express from "express";
import { pool } from "../db.js";

const router = express.Router();

// GET: Listar todas las categorías
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Categoria ORDER BY Nombre ASC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener categorías" });
  }
});

// POST: Crear nueva categoría
router.post("/", async (req, res) => {
  const { Nombre } = req.body;
  if (!Nombre || !Nombre.trim()) return res.status(400).json({ error: "Nombre es obligatorio" });

  try {
    const [result] = await pool.query("INSERT INTO Categoria (Nombre) VALUES (?)", [Nombre.trim()]);
    res.json({ id: result.insertId, Nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al crear categoría" });
  }
});

// PUT: Editar categoría
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Nombre } = req.body;
  if (!Nombre || !Nombre.trim()) return res.status(400).json({ error: "Nombre es obligatorio" });

  try {
    await pool.query("UPDATE Categoria SET Nombre = ? WHERE IdCategoria = ?", [Nombre.trim(), id]);
    res.json({ id, Nombre });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al actualizar categoría" });
  }
});

// DELETE: Eliminar categoría
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM Categoria WHERE IdCategoria = ?", [id]);
    res.json({ message: "Categoría eliminada" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al eliminar categoría" });
  }
});

export default router;
