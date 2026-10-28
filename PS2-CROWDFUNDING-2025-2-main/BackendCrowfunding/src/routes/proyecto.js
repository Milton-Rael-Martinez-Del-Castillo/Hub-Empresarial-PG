import express from "express";
import multer from "multer";
import path from "path";
import { pool } from "../db.js";

const router = express.Router();

router.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if (file.fieldname === "Documentos") {
    if (![".pdf", ".docx", ".xlsx"].includes(ext)) {
      return cb(new Error("Documentos solo pueden ser PDF, DOCX o XLSX"));
    }
  } else if (file.fieldname === "ImagenPrincipal" || file.fieldname === "ImagenesAdicionales") {
    if (![".png", ".jpg", ".jpeg", ".gif"].includes(ext)) {
      return cb(new Error("Solo se permiten imágenes PNG, JPG, JPEG o GIF"));
    }
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
router.get("/todos", async (req, res) => {
  const sql = `
    SELECT 
      p.IdProyecto,
      p.Nombre AS Titulo,
      c.Nombre AS Categoria,
      p.DescripcionCorta,
      p.ImagenPrincipal,
      p.EstadoAprobacion,
      p.FechaInicio,
      p.FechaFin,
      u.IdUser AS IdCreador,
      u.Nombre AS NombreCreador,
      u.PrimerApellido AS ApellidoCreador,
      u.ImagenPerfil AS ImagenCreador
    FROM Proyecto p
    INNER JOIN Usuario u ON p.IdCreador = u.IdUser
    LEFT JOIN Categoria c ON p.IdCategoria = c.IdCategoria
    WHERE p.EstadoActivo = TRUE AND p.EstadoAprobacion = 'Activo'
    ORDER BY p.FechaInicio DESC;
  `;
  try {
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener detalles del proyecto con asesorías
router.get("/explorar/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [proyecto] = await pool.query(
      `SELECT p.IdProyecto, p.Nombre AS Titulo, c.Nombre AS Categoria,
              p.DescripcionCorta, p.DescripcionGeneral, p.FechaInicio, p.FechaFin,
              p.Video, p.ImagenPrincipal, u.IdUser AS IdCreador, u.Nombre AS NombreCreador,
              u.PrimerApellido AS ApellidoCreador, u.ImagenPerfil AS ImagenCreador,
              u.Correo AS CorreoCreador,
              p.ResponsableNombre, p.ResponsableTelefono
       FROM Proyecto p
       INNER JOIN Usuario u ON p.IdCreador = u.IdUser
       INNER JOIN Categoria c ON p.IdCategoria = c.IdCategoria
       WHERE p.IdProyecto = ?`,
      [id]
    );

    if (!proyecto.length) {
      return res.status(404).json({ error: "Proyecto no encontrado" });
    }

    const proyectoData = proyecto[0];

    const [imagenes] = await pool.query(
      "SELECT UrlImagen FROM Proyecto_Imagen WHERE IdProyecto = ?", 
      [id]
    );

    const [documentos] = await pool.query(
      "SELECT NombreDocumento, CONCAT('/uploads/', SUBSTRING_INDEX(UrlDocumento, '/', -1)) AS UrlDocumento, TipoDocumento FROM Proyecto_Documento WHERE IdProyecto = ?", 
      [id]
    );

    const [redes] = await pool.query(
      "SELECT Url FROM Proyecto_RedSocial WHERE IdProyecto = ?", 
      [id]
    );

    const [asesorias] = await pool.query(
      `SELECT 
          a.IdAsesoria,
          a.Nombre,
          pa.Completada
       FROM Proyecto_Asesoria pa
       INNER JOIN Asesoria a ON pa.IdAsesoria = a.IdAsesoria
       WHERE pa.IdProyecto = ?`,
      [id]
    );

    const [seguidores] = await pool.query(
      "SELECT COUNT(*) AS Total FROM Usuario_Proyecto WHERE IdProyecto = ?",
      [id]
    );

    res.json({
      ...proyectoData,
      ImagenesAdicionales: imagenes || [],
      Documentos: documentos || [],
      RedesSociales: redes || [],
      AsesoriasSeleccionadas: asesorias || [],
      Seguidores: seguidores[0].Total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// Obtener proyectos creados por un usuario, incluyendo finalizados
router.get("/creados/:idUser", async (req, res) => {
  const { idUser } = req.params;
  const sql = `
    SELECT 
      p.IdProyecto,
      p.Nombre AS Titulo,
      p.DescripcionCorta,
      p.ImagenPrincipal,
      p.EstadoAprobacion,
      p.FechaInicio,
      p.FechaFin,
      p.EstadoCierre,
      u.Nombre AS NombreCreador,
      u.PrimerApellido AS ApellidoCreador
    FROM Proyecto p
    INNER JOIN Usuario u ON p.IdCreador = u.IdUser
    WHERE p.IdCreador = ? 
      AND (p.EstadoActivo = TRUE 
           OR p.EstadoCierre IN ('FinalizadoExitoso', 'FinalizadoIncompleto'))
    ORDER BY p.FechaInicio DESC;
  `;
  try {
    const [results] = await pool.query(sql, [idUser]);
    res.json(results);
  } catch (err) {
    console.error("Error en /creados/:idUser:", err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener proyectos eliminados (EstadoActivo = FALSE)
router.get("/removidos", async (req, res) => {
  const sql = `
    SELECT 
      p.IdProyecto,
      p.Nombre AS Titulo,
      p.DescripcionCorta,
      p.ImagenPrincipal,
      p.EstadoAprobacion,
      p.FechaInicio,
      p.FechaFin,
      u.Nombre AS NombreCreador,
      u.PrimerApellido AS ApellidoCreador
    FROM Proyecto p
    INNER JOIN Usuario u ON p.IdCreador = u.IdUser
    WHERE p.EstadoActivo = FALSE
    ORDER BY p.FechaInicio DESC;
  `;
  try {
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Restaurar proyecto eliminado (EstadoActivo = TRUE)
router.put("/restaurar/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Proyecto SET EstadoActivo = TRUE WHERE IdProyecto = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json({ message: "Proyecto restaurado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Eliminar proyecto físicamente
router.delete("/borrar/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM Proyecto WHERE IdProyecto = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json({ message: "Proyecto eliminado permanentemente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seguir proyecto
router.post("/seguir", async (req, res) => {
  const { IdUser, IdProyecto } = req.body;
  if (!IdUser || !IdProyecto) return res.status(400).json({ error: "Datos incompletos" });

  const sql = "INSERT INTO Usuario_Proyecto (IdUser, IdProyecto) VALUES (?, ?)";
  try {
    await pool.query(sql, [IdUser, IdProyecto]);
    res.json({ message: "Me gusta registrado correctamente" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Ya diste me gusta a este proyecto" });
    res.status(500).json({ error: err.message });
  }
});

// Quitar el seguido
router.delete("/seguir", async (req, res) => {
  const { IdUser, IdProyecto } = req.body;
  if (!IdUser || !IdProyecto) return res.status(400).json({ error: "Datos incompletos" });

  const sql = "DELETE FROM Usuario_Proyecto WHERE IdUser = ? AND IdProyecto = ?";
  try {
    await pool.query(sql, [IdUser, IdProyecto]);
    res.json({ message: "Me gusta eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Crear proyecto
router.post("/crear", (req, res) => {
  upload.fields([
    { name: "ImagenPrincipal", maxCount: 1 },
    { name: "ImagenesAdicionales", maxCount: 10 },
    { name: "Documentos", maxCount: 5 },
  ])(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      const errors = {};
      if (err.field === "ImagenesAdicionales") errors.ImagenesAdicionales = err.message;
      else if (err.field === "Documentos") errors.Documentos = err.message;
      else if (err.field === "ImagenPrincipal") errors.ImagenPrincipal = err.message;
      else errors.general = err.message;
      return res.status(400).json({ error: errors });
    } else if (err) {
      return res.status(400).json({ error: { general: err.message } });
    }

    try {
      const {
        Nombre,
        IdCategoria,
        DescripcionCorta,
        DescripcionGeneral,
        FechaFin,
        Video,
        IdCreador,
        ResponsableNombre,
        ResponsableTelefono,
        AsesoriasSeleccionadas
      } = req.body;

      const errors = {};
      if (!Nombre) errors.Nombre = "Nombre obligatorio";
      if (!IdCategoria) errors.IdCategoria = "Categoría obligatoria";
      if (!DescripcionGeneral) errors.DescripcionGeneral = "Descripción general obligatoria";
      if (Object.keys(errors).length > 0) return res.status(400).json({ error: errors });

      // Fechas: inicio = hoy, fin máximo 30 días
      const hoy = new Date();
      const fechaInicioDate = hoy;
      let fechaFinDate = FechaFin ? new Date(FechaFin) : new Date();
      const maxFechaFin = new Date();
      maxFechaFin.setDate(hoy.getDate() + 30);
      if (fechaFinDate > maxFechaFin) fechaFinDate = maxFechaFin;

      // Imagen principal
      const ImagenPrincipal = req.files["ImagenPrincipal"]?.[0]
        ? "/uploads/" + req.files["ImagenPrincipal"][0].filename
        : null;

      // Insertar proyecto
      const [result] = await pool.query(
        `INSERT INTO Proyecto 
        (Nombre, IdCategoria, DescripcionCorta, DescripcionGeneral, FechaInicio, FechaFin, Video, ImagenPrincipal, IdCreador, ContribuyenteLimite, EstadoActivo, EstadoAprobacion, ResponsableNombre, ResponsableTelefono)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, TRUE, 'Pendiente', ?, ?)`,
        [Nombre, IdCategoria, DescripcionCorta, DescripcionGeneral, fechaInicioDate, fechaFinDate, Video, ImagenPrincipal, IdCreador, ResponsableNombre, ResponsableTelefono]
      );

      const nuevoProyectoId = result.insertId;

      // Guardar asesorías seleccionadas correctamente aunque venga como JSON string
      let asesoriasArray = [];
      if (AsesoriasSeleccionadas) {
        if (typeof AsesoriasSeleccionadas === "string") {
          try {
            asesoriasArray = JSON.parse(AsesoriasSeleccionadas);
          } catch (e) {
            asesoriasArray = [];
          }
        } else if (Array.isArray(AsesoriasSeleccionadas)) {
          asesoriasArray = AsesoriasSeleccionadas;
        }
      }

      if (asesoriasArray.length > 0) {
        const asesoriaValues = asesoriasArray.map(idAsesoria => [nuevoProyectoId, idAsesoria, false]);
        await pool.query(
          "INSERT INTO Proyecto_Asesoria (IdProyecto, IdAsesoria, Completada) VALUES ?",
          [asesoriaValues]
        );
      }

      // Imágenes adicionales
      if (req.files["ImagenesAdicionales"]) {
        const imagenes = req.files["ImagenesAdicionales"].map(img => [nuevoProyectoId, "/uploads/" + img.filename]);
        await pool.query("INSERT INTO Proyecto_Imagen (IdProyecto, UrlImagen) VALUES ?", [imagenes]);
      }

      // Documentos
      if (req.files["Documentos"]) {
        const documentos = req.files["Documentos"].map(doc => [
          nuevoProyectoId,
          doc.originalname,
          "/uploads/" + doc.filename,
          path.extname(doc.filename).replace(".", "").toUpperCase()
        ]);
        await pool.query("INSERT INTO Proyecto_Documento (IdProyecto, NombreDocumento, UrlDocumento, TipoDocumento) VALUES ?", [documentos]);
      }

      // Redes sociales
      if (req.body.RedesSociales) {
        let redes = [];
        try {
          const parsed = typeof req.body.RedesSociales === "string" ? JSON.parse(req.body.RedesSociales) : req.body.RedesSociales;
          const validTypes = ["Facebook","Instagram","YouTube","Twitter","TikTok"];
          const isValidUrlForNetwork = (url, network) => {
            const lower = url.toLowerCase();
            if (network === "Facebook") return lower.includes("facebook.com");
            if (network === "Instagram") return lower.includes("instagram.com");
            if (network === "YouTube") return lower.includes("youtube.com") || lower.includes("youtu.be");
            if (network === "Twitter") return lower.includes("twitter.com");
            if (network === "TikTok") return lower.includes("tiktok.com");
            return false;
          };

          redes = parsed
            .filter(r => validTypes.includes(r.Tipo) && r.Url.trim() && isValidUrlForNetwork(r.Url, r.Tipo))
            .slice(0, 5) // máximo 5 redes
            .map(r => [nuevoProyectoId, r.Url]);

          if (redes.length) await pool.query("INSERT INTO Proyecto_RedSocial (IdProyecto, Url) VALUES ?", [redes]);
        } catch (e) {
          console.warn("Error parsing RedesSociales:", e);
        }
      }

      res.json({ message: "Proyecto creado correctamente", IdProyecto: nuevoProyectoId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: { general: err.message } });
    }
  });
});

// GET /api/proyectos/categorias
router.get("/categorias", async (req, res) => {
  try {
    const [categorias] = await pool.query(
      "SELECT IdCategoria, Nombre AS NombreCategoria FROM Categoria"
    );
    res.json(categorias);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Buscar proyectos por nombre y/o categoría
router.get("/buscar", async (req, res) => {
  try {
    const { nombre = "", idCategoria = "" } = req.query;

    // Construir query dinámicamente
    let sql = `
      SELECT 
        p.IdProyecto,
        p.Nombre,
        c.Nombre AS Categoria,
        p.DescripcionCorta,
        p.ImagenPrincipal,
        p.FechaInicio,
        p.FechaFin,
        u.Nombre AS NombreCreador,
        u.PrimerApellido AS ApellidoCreador
      FROM Proyecto p
      JOIN Categoria c ON p.IdCategoria = c.IdCategoria
      JOIN Usuario u ON p.IdCreador = u.IdUser
      WHERE p.EstadoActivo = TRUE AND p.EstadoAprobacion = 'Activo'
    `;
    const params = [];

    if (nombre) {
      sql += " AND LOWER(p.Nombre) LIKE ?";
      params.push("%" + nombre.toLowerCase() + "%");
    }

    if (idCategoria) {
      sql += " AND p.IdCategoria = ?";
      params.push(idCategoria);
    }

    sql += " ORDER BY p.FechaInicio DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al buscar proyectos" });
  }
});
// Editar proyecto
router.put("/editar/:id", upload.single("ImagenPrincipal"), async (req, res) => {
  const { id } = req.params;
  const { Nombre, DescripcionCorta, DescripcionGeneral, FechaInicio, FechaFin, Video, ModificadoPor } = req.body;

  if (!Nombre || !DescripcionGeneral)
    return res.status(400).json({ error: "Nombre y descripción general son obligatorios" });

  if (FechaInicio && FechaFin && new Date(FechaInicio) > new Date(FechaFin))
    return res.status(400).json({ error: "La fecha de inicio no puede ser posterior a la fecha de fin" });

  const ImagenPrincipal = req.file ? "/uploads/" + req.file.filename : null;

  // Construir SET dinámico sin FechaActualizacion
  const campos = [
    "Nombre = ?",
    "DescripcionCorta = ?",
    "DescripcionGeneral = ?",
    "FechaInicio = ?",
    "FechaFin = ?",
    "Video = ?"
  ];
  const params = [Nombre, DescripcionCorta, DescripcionGeneral, FechaInicio, FechaFin, Video];

  if (ImagenPrincipal) {
    campos.push("ImagenPrincipal = ?");
    params.push(ImagenPrincipal);
  }

  const sqlUpdate = `UPDATE Proyecto SET ${campos.join(", ")} WHERE IdProyecto = ?;`;
  params.push(id);

  const sqlHistorial = `
    INSERT INTO Proyecto_Historial 
      (IdProyecto, FechaModificacion, ModificadoPor, TipoCambio)
    VALUES (?, NOW(), ?, 'Update')
  `;

  try {
    const [result] = await pool.query(sqlUpdate, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Proyecto no encontrado" });

    await pool.query(sqlHistorial, [id, ModificadoPor || null]);
    res.json({ message: "Proyecto actualizado correctamente y registrado en historial" });
  } catch (err) {
    console.error(err); // loguea el error completo para debugging
    res.status(500).json({ error: err.message });
  }
});

// Eliminar proyecto (lógico)
router.delete("/eliminar/:id", async (req, res) => {
  const { id } = req.params;
  const sql = "UPDATE Proyecto SET EstadoActivo = FALSE WHERE IdProyecto = ?";
  try {
    const [result] = await pool.query(sql, [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json({ message: "Proyecto eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/proyectos/pendientes
router.get("/pendientes", async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.IdProyecto,
        p.Nombre,
        p.DescripcionCorta,
        p.ImagenPrincipal,
        p.EstadoAprobacion,
        p.FechaInicio,
        p.FechaFin,
        u.IdUser AS IdCreador,
        u.Nombre AS NombreCreador,
        u.PrimerApellido AS ApellidoCreador,
        u.ImagenPerfil AS ImagenCreador
      FROM Proyecto p
      INNER JOIN Usuario u ON p.IdCreador = u.IdUser
      WHERE p.EstadoActivo = TRUE AND p.EstadoAprobacion = 'Pendiente'
      ORDER BY p.FechaInicio DESC
    `;
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/proyectos/aprobar/:id
router.put("/aprobar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `UPDATE Proyecto SET EstadoAprobacion = 'Activo' WHERE IdProyecto = ?`;
    await pool.query(sql, [id]);
    res.json({ message: "Proyecto aprobado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/proyectos/cancelar/:id
router.put("/cancelar/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `UPDATE Proyecto SET EstadoAprobacion = 'Cancelado' WHERE IdProyecto = ?`;
    await pool.query(sql, [id]);
    res.json({ message: "Proyecto cancelado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/proyectos/eliminar-logico/:id
router.delete("/eliminar-logico/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `UPDATE Proyecto SET EstadoActivo = FALSE WHERE IdProyecto = ?`;
    await pool.query(sql, [id]);
    res.json({ message: "Proyecto eliminado lógicamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/donados/:idUser", async (req, res) => {
  const { idUser } = req.params;

  const sql = `
    SELECT 
      p.IdProyecto,
      p.Nombre AS Titulo,
      p.DescripcionCorta,
      p.ImagenPrincipal,
      u.Nombre AS NombreCreador,
      u.PrimerApellido AS ApellidoCreador
    FROM Proyecto p
    INNER JOIN Usuario_Proyecto up ON p.IdProyecto = up.IdProyecto
    INNER JOIN Usuario u ON p.IdCreador = u.IdUser
    WHERE up.IdUser = ?
    ORDER BY p.FechaInicio DESC
  `;

  try {
    const [results] = await pool.query(sql, [idUser]);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/destacados", async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.IdProyecto,
        p.Nombre,
        c.Nombre AS Categoria,
        p.DescripcionCorta,
        p.ImagenPrincipal,
        u.Nombre AS NombreCreador,
        u.PrimerApellido AS ApellidoCreador,
        COUNT(up.IdUser) AS MeGustas
      FROM Proyecto p
      LEFT JOIN Usuario_Proyecto up ON p.IdProyecto = up.IdProyecto
      INNER JOIN Usuario u ON p.IdCreador = u.IdUser
      LEFT JOIN Categoria c ON p.IdCategoria = c.IdCategoria
      WHERE p.EstadoActivo = TRUE AND p.EstadoAprobacion = 'Activo'
      GROUP BY 
        p.IdProyecto, p.Nombre, c.Nombre, p.DescripcionCorta, 
        p.ImagenPrincipal, u.Nombre, u.PrimerApellido
      HAVING MeGustas > 0
      ORDER BY MeGustas DESC
      LIMIT 10
    `;
    const [results] = await pool.query(sql);
    res.json(results);
  } catch (err) {
    console.error('Error en /destacados:', err);
    res.status(500).json({ error: err.message });
  }
});

// Obtener proyecto por Id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT 
      p.IdProyecto,
      p.Nombre AS Titulo,
      p.DescripcionCorta,
      p.DescripcionGeneral,
      p.FechaInicio,
      p.FechaFin,
      p.Video,
      p.ImagenPrincipal
    FROM Proyecto p
    WHERE p.IdProyecto = ?;
  `;
  try {
    const [results] = await pool.query(sql, [id]);
    if (results.length === 0) return res.status(404).json({ error: "Proyecto no encontrado" });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// Middleware global para errores de multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err); // log de todos los errores
  res.status(500).json({ error: err.message });
});


export default router;