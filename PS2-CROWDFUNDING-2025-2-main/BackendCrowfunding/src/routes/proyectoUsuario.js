import express from "express";
import multer from "multer";
import path from "path";
import { pool } from "../db.js";

const router = express.Router();

// Configuración de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.fieldname === "Documentos" && ![".pdf", ".docx", ".xlsx"].includes(ext))
    return cb(new Error("Documentos solo pueden ser PDF, DOCX o XLSX"));
  if (
    (file.fieldname === "ImagenPrincipal" || file.fieldname === "ImagenesAdicionales") &&
    ![".png", ".jpg", ".jpeg", ".gif"].includes(ext)
  )
    return cb(new Error("Solo se permiten imágenes PNG, JPG, JPEG o GIF"));
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// GET proyecto
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [proyecto] = await pool.query(
      `SELECT 
         p.IdProyecto,
         p.Nombre AS Titulo,
         p.DescripcionCorta,
         p.DescripcionGeneral,
         p.FechaFin,
         p.Video,
         p.ImagenPrincipal
       FROM Proyecto p
       WHERE p.IdProyecto = ?`,
      [id]
    );

    if (!proyecto.length) return res.status(404).json({ error: "Proyecto no encontrado" });

    const proyectoData = proyecto[0];

    const [asesorias] = await pool.query(
      `SELECT a.IdAsesoria, a.Nombre, pa.Completada
       FROM Proyecto_Asesoria pa
       INNER JOIN Asesoria a ON pa.IdAsesoria = a.IdAsesoria
       WHERE pa.IdProyecto = ?`,
      [id]
    );

    const [imagenes] = await pool.query(
      "SELECT UrlImagen FROM Proyecto_Imagen WHERE IdProyecto = ?",
      [id]
    );

    const [documentos] = await pool.query(
      "SELECT NombreDocumento, UrlDocumento, TipoDocumento FROM Proyecto_Documento WHERE IdProyecto = ?",
      [id]
    );

    res.json({
      ...proyectoData,
      AsesoriasSeleccionadas: asesorias || [],
      ImagenesAdicionales: imagenes || [],
      Documentos: documentos || [],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// PUT editar proyecto
router.put(
  "/editar/:id",
  upload.fields([
    { name: "ImagenPrincipal", maxCount: 1 },
    { name: "ImagenesAdicionales", maxCount: 10 },
    { name: "Documentos", maxCount: 5 },
  ]),
  async (req, res) => {
    const { id } = req.params;

    let { Nombre, DescripcionCorta, DescripcionGeneral, Video, AsesoriasSeleccionadas, Completadas } = req.body;

    if (!Nombre || !DescripcionGeneral)
      return res.status(400).json({ error: "Nombre y descripción general son obligatorios" });

    try {
      // Imagen principal nueva
      const ImagenPrincipal = req.files["ImagenPrincipal"]?.[0]
        ? "/uploads/" + req.files["ImagenPrincipal"][0].filename
        : null;

      // Actualizar proyecto sin tocar FechaFin
      const campos = ["Nombre = ?", "DescripcionCorta = ?", "DescripcionGeneral = ?", "Video = ?"];
      const params = [Nombre, DescripcionCorta, DescripcionGeneral, Video];

      if (ImagenPrincipal) {
        campos.push("ImagenPrincipal = ?");
        params.push(ImagenPrincipal);
      }

      params.push(id);

      await pool.query(`UPDATE Proyecto SET ${campos.join(", ")} WHERE IdProyecto = ?`, params);

      // ASESORÍAS
      if (AsesoriasSeleccionadas) {
        let arrayAsesorias =
          typeof AsesoriasSeleccionadas === "string"
            ? JSON.parse(AsesoriasSeleccionadas)
            : AsesoriasSeleccionadas;

        let completadasObj =
          typeof Completadas === "string"
            ? JSON.parse(Completadas)
            : Completadas || {};

        if (!Array.isArray(arrayAsesorias)) arrayAsesorias = [];

        await pool.query("DELETE FROM Proyecto_Asesoria WHERE IdProyecto = ?", [id]);

        if (arrayAsesorias.length > 0) {
          const values = arrayAsesorias.map((a) => [id, a, !!completadasObj[a]]);
          await pool.query("INSERT INTO Proyecto_Asesoria (IdProyecto, IdAsesoria, Completada) VALUES ?", [values]);
        }
      }

      // Obtener datos para calcular estado
      const [[{ Total: totalAsesorias }]] = await pool.query(
        "SELECT COUNT(*) AS Total FROM Proyecto_Asesoria WHERE IdProyecto = ?",
        [id]
      );

      const [[{ Total: asesCompletadas }]] = await pool.query(
        "SELECT COUNT(*) AS Total FROM Proyecto_Asesoria WHERE IdProyecto = ? AND Completada = TRUE",
        [id]
      );

      const [[{ FechaFin: fechaFinDB }]] = await pool.query(
        "SELECT FechaFin FROM Proyecto WHERE IdProyecto = ?",
        [id]
      );

      const fechaFin = fechaFinDB ? new Date(fechaFinDB) : null;
      const hoy = new Date();

      let nuevoEstadoCierre = "Activo";
      let nuevoEstadoActivo = true;

      if (totalAsesorias > 0 && fechaFin) {
        if (asesCompletadas === totalAsesorias && hoy <= fechaFin) {
          nuevoEstadoCierre = "FinalizadoExitoso";
          nuevoEstadoActivo = false;
        } else if (hoy > fechaFin) {
          nuevoEstadoCierre = "FinalizadoIncompleto";
          nuevoEstadoActivo = false;
        }
      }

      await pool.query(
        "UPDATE Proyecto SET EstadoCierre = ?, EstadoActivo = ? WHERE IdProyecto = ?",
        [nuevoEstadoCierre, nuevoEstadoActivo, id]
      );

      // Imágenes adicionales
      if (req.files["ImagenesAdicionales"]?.length > 0) {
        const imgs = req.files["ImagenesAdicionales"].map((img) => [id, "/uploads/" + img.filename]);
        await pool.query("INSERT INTO Proyecto_Imagen (IdProyecto, UrlImagen) VALUES ?", [imgs]);
      }

      // Documentos
      if (req.files["Documentos"]?.length > 0) {
        const docs = req.files["Documentos"].map((doc) => [
          id,
          doc.originalname,
          "/uploads/" + doc.filename,
          path.extname(doc.filename).replace(".", "").toUpperCase(),
        ]);
        await pool.query(
          "INSERT INTO Proyecto_Documento (IdProyecto, NombreDocumento, UrlDocumento, TipoDocumento) VALUES ?",
          [docs]
        );
      }

      // Retornar datos actualizados
      const [updated] = await pool.query("SELECT * FROM Proyecto WHERE IdProyecto = ?", [id]);
      const [asesorias] = await pool.query(
        `SELECT a.IdAsesoria, a.Nombre, pa.Completada
         FROM Proyecto_Asesoria pa
         INNER JOIN Asesoria a ON pa.IdAsesoria = a.IdAsesoria
         WHERE pa.IdProyecto = ?`,
        [id]
      );

      const [imagenes] = await pool.query("SELECT UrlImagen FROM Proyecto_Imagen WHERE IdProyecto = ?", [id]);
      const [documentos] = await pool.query(
        "SELECT NombreDocumento, UrlDocumento, TipoDocumento FROM Proyecto_Documento WHERE IdProyecto = ?",
        [id]
      );

      res.json({
        message: "Proyecto actualizado correctamente (usuario)",
        proyecto: updated[0],
        AsesoriasSeleccionadas: asesorias,
        ImagenesAdicionales: imagenes,
        Documentos: documentos,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
