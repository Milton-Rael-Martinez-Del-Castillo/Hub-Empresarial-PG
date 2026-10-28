import { pool } from "../db.js";
import bcrypt from "bcrypt";

export async function getUsers(req, res) {
  try {
    const includeDeleted = req.query.includeDeleted === "1" || req.query.includeDeleted === "true";
    const where = includeDeleted ? "" : "WHERE Estado = 1";
    const sql = `
      SELECT
        IdUser,
        NombreUsuario,
        Nombre,
        PrimerApellido,
        SegundoApellido,
        ImagenPerfil,
        Correo,
        Telefono,
        Estado,
        Id_Rol,
        FechaCreacion,
        CASE WHEN Estado = 0 THEN 1 ELSE 0 END AS Eliminado
      FROM Usuario
      ${where}
      ORDER BY IdUser DESC
    `;
    const [rows] = await pool.query(sql);
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      `SELECT IdUser, NombreUsuario, Nombre, PrimerApellido, SegundoApellido, ImagenPerfil, Correo, Telefono, Estado, Id_Rol, FechaCreacion FROM Usuario WHERE IdUser = ?`,
      [id]
    );
    if (!rows.length) return res.status(404).json({ success: false, message: "No encontrado" });
    res.json({ success: true, data: rows[0] });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function createUser(req, res) {
  try {
    const {
      NombreUsuario,
      Nombre,
      PrimerApellido,
      SegundoApellido = null,
      ImagenPerfil = null,
      Correo,
      Contrasenia = "",
      Telefono = null,
      Id_Rol = 2,
      Estado = 1,
    } = req.body;

    if (!NombreUsuario || !Nombre || !PrimerApellido || !Correo || Contrasenia.length < 6) {
      return res.status(400).json({ success: false, message: "Faltan campos obligatorios o contraseña inválida" });
    }

    const hashedPassword = await bcrypt.hash(Contrasenia, 10);

    const [result] = await pool.query(
      `INSERT INTO Usuario (NombreUsuario, Nombre, PrimerApellido, SegundoApellido, ImagenPerfil, Correo, Contrasenia, Telefono, Estado, Id_Rol) VALUES (?,?,?,?,?,?,?,?,?,?)`,
      [NombreUsuario, Nombre, PrimerApellido, SegundoApellido, ImagenPerfil, Correo, hashedPassword, Telefono, Estado, Id_Rol]
    );

    res.status(201).json({ success: true, IdUser: result.insertId });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const body = { ...req.body };

    if (body.Contrasenia) body.Contrasenia = await bcrypt.hash(body.Contrasenia, 10);

    const fields = ["NombreUsuario","Nombre","PrimerApellido","SegundoApellido","Correo","Telefono","Id_Rol","Estado"];
    const sets = [];
    const values = [];

    for (const f of fields) {
      if (Object.prototype.hasOwnProperty.call(body, f)) {
        if (body[f] === "" || body[f] === null) continue; // <--- solo actualizar si tiene valor
        sets.push(`${f} = ?`);
        values.push(body[f]);
      }
    }

    if (body.Contrasenia) {
      sets.push("Contrasenia = ?");
      values.push(body.Contrasenia);
    }

    if (!sets.length) return res.status(400).json({ success: false, message: "Nada para actualizar" });

    values.push(id);
    const [result] = await pool.query(`UPDATE Usuario SET ${sets.join(", ")} WHERE IdUser = ?`, values);

    if (!result.affectedRows) return res.status(404).json({ success: false, message: "No encontrado" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`UPDATE Usuario SET Estado = 0 WHERE IdUser = ? AND Estado <> 0`, [id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "No encontrado o ya inactivo" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}

export async function restoreUser(req, res) {
  try {
    const { id } = req.params;
    const [result] = await pool.query(`UPDATE Usuario SET Estado = 1 WHERE IdUser = ? AND Estado = 0`, [id]);
    if (!result.affectedRows) return res.status(404).json({ success: false, message: "No encontrado o ya activo" });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
}
