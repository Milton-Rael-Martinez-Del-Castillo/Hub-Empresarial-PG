import { pool } from "../db.js";

const Usuario = {
  getAll: async (callback) => {
    try {
      const [rows] = await pool.query("SELECT * FROM Usuario");
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  },

  getById: async (id, callback) => {
    try {
      const [rows] = await pool.query("SELECT * FROM Usuario WHERE IdUser = ?", [id]);
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  },

  getByEmail: async (email, callback) => {
    try {
      const [rows] = await pool.query("SELECT * FROM Usuario WHERE Correo = ?", [email]);
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  },

  getByUsername: async (username, callback) => {
    try {
      const [rows] = await pool.query("SELECT * FROM Usuario WHERE NombreUsuario = ?", [username]);
      callback(null, rows);
    } catch (err) {
      callback(err, null);
    }
  },

  create: async (data, callback) => {
    try {
      const [result] = await pool.query("INSERT INTO Usuario SET ?", data);
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  },

  update: async (id, data, callback) => {
    try {
      const [result] = await pool.query("UPDATE Usuario SET ? WHERE IdUser = ?", [data, id]);
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  },

  updateByEmail: async (email, data, callback) => {
    try {
      const [result] = await pool.query("UPDATE Usuario SET ? WHERE Correo = ?", [data, email]);
      callback(null, result);
    } catch (err) {
      callback(err, null);
    }
  },
};

export default Usuario;
