import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { pool, checkDbRetry } from "./db.js";
import cron from "node-cron";
import nodemailer from "nodemailer";

// Rutas
import usuarioRoutes from "./routes/usuarios.js";
import usersRoutes from "./routes/users.js";
import proyectosRoutes from "./routes/proyecto.js";
import twoFARoutes from "./routes/2fa.js";
import categoriasRouter from "./routes/categorias.js";
import asesoriasRouter from "./routes/asesorias.js";
import proyectoUsuarioRoutes from "./routes/proyectoUsuario.js";

dotenv.config();

const app = express();

// CONFIGURACIÓN CORS
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// MIDDLEWARE GLOBAL PARA JSON
app.use(express.json({ limit: "10mb" }));

// CONFIGURAR STATIC /uploads PARA IMÁGENES Y DOCUMENTOS CON CONTENT-TYPE
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res, filePath) => {
      const ext = path.extname(filePath).toLowerCase();
      if (ext === ".pdf") res.type("application/pdf");
      else if (ext === ".docx")
        res.type(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        );
      else if (ext === ".xlsx")
        res.type(
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
      else if ([".png", ".jpg", ".jpeg", ".gif"].includes(ext))
        res.type("image/" + ext.replace(".", ""));
    },
  })
);

// RUTAS BASE
app.get("/", (_req, res) => res.send("API Incuvalab viva"));

// Ruta para chequear conexión a DB
app.get("/check-db", async (_req, res) => {
  try {
    const ok = await checkDbRetry();
    res.json({ dbOk: ok });
  } catch (err) {
    console.error("Error al chequear DB:", err.message);
    res.status(500).json({ dbOk: false, error: err.message });
  }
});

// RUTAS
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/proyectos", proyectosRoutes);
app.use("/api/2fa", twoFARoutes);
app.use("/api/categorias", categoriasRouter);
app.use("/api/asesorias", asesoriasRouter);
app.use("/api/proyectos-usuario", proyectoUsuarioRoutes);

// CONFIGURACIÓN NODEMAILER
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "landesl502@gmail.com",
    pass: "perw nbtu xrqc vqps", // app password
  },
});

// FUNCION PARA REVISAR PROYECTOS INCOMPLETOS
const revisarProyectosIncompletos = async () => {
  console.log("Revisando proyectos incompletos...");

  try {
    const [proyectos] = await pool.query(`
      SELECT DISTINCT p.IdProyecto, p.FechaFin, p.Nombre AS NombreProyecto, u.Correo, u.Nombre AS NombreUsuario
      FROM Proyecto p
      JOIN Usuario u ON p.IdCreador = u.IdUser
      JOIN Proyecto_Asesoria pa ON p.IdProyecto = pa.IdProyecto
      WHERE p.FechaFin IS NOT NULL
        AND p.FechaFin < NOW()
        AND p.EstadoActivo = TRUE
        AND pa.Completada = 0
    `);

    if (!proyectos.length) {
      console.log("No hay proyectos para marcar como incompletos.");
      return;
    }

    const ids = proyectos.map((p) => p.IdProyecto);

    // Actualiza los proyectos a FinalizadoIncompleto
    await pool.query(
      `UPDATE Proyecto 
       SET EstadoCierre = 'FinalizadoIncompleto', EstadoActivo = FALSE
       WHERE IdProyecto IN (?)`,
      [ids]
    );
    console.log(`Se actualizaron ${ids.length} proyectos a FinalizadoIncompleto`);

    // Enviar correo a cada usuario
    for (const proyecto of proyectos) {
      try {
        const fechaFin = new Date(proyecto.FechaFin).toISOString().split("T")[0];
        const mailOptions = {
          from: "Soporte IncubaLab <landesl502@gmail.com>",
          to: proyecto.Correo,
          subject: `Proyecto "${proyecto.NombreProyecto}" cerrado como incompleto`,
          html: `
            <div style="text-align:center;">
              <h2>Notificación de proyecto incompleto</h2>
              <p>Hola <b>${proyecto.NombreUsuario}</b>,</p>
              <p>El proyecto <b>${proyecto.NombreProyecto}</b> ha sido cerrado automáticamente como <b>incompleto</b> porque su fecha de finalización (${fechaFin}) ya pasó y no logró completar todas sus Requisitos de su campaña.</p>
              <p>Por favor, revisa los detalles y toma las acciones necesarias.</p>
              <p>Saludos,<br/>IncubaLab</p>
            </div>
          `,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Correo enviado a ${proyecto.Correo}`);
      } catch (err) {
        console.error(`Error enviando correo a ${proyecto.Correo}:`, err);
      }
    }
  } catch (err) {
    console.error("Error revisando proyectos incompletos:", err);
  }
};

// CRON JOB: se ejecuta todos los días a medianoche
cron.schedule("0 0 * * *", revisarProyectosIncompletos);

// INICIAR SERVIDOR
const PORT = process.env.PORT || 4000;
const start = async () => {
  try {
    await checkDbRetry();
    console.log("DB OK");

    app.listen(PORT, () =>
      console.log(`API escuchando en http://localhost:${PORT}`)
    );

    // --- EJECUTAR REVISIÓN INMEDIATA PARA PRUEBA ---
    await revisarProyectosIncompletos();

  } catch (e) {
    console.error("Error al iniciar servidor:", e);
    process.exit(1);
  }
};
start();

// CERRAR CONEXIÓN DB AL SALIR
process.on("SIGINT", async () => {
  try {
    await pool.end();
    console.log("Conexión DB cerrada.");
  } catch {}
  process.exit(0);
});
