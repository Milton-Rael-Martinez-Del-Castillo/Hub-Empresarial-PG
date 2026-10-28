import "dotenv/config";
import mysql from "mysql2/promise";

const {
  DB_HOST = "localhost",
  DB_USER = "root",
  DB_PASSWORD = "Univalle.",
  DB_NAME = "crowdfunding",
  DB_PORT = 3306,
} = process.env;
// Crear pool con charset UTF8MB4 real
export const pool = mysql.createPool({
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: Number(DB_PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: "utf8mb4", //
});
// Forzar UTF-8 en cada conexión
pool.on("connection", (conn) => {
  conn.query("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;");
});
// FUNCIÓN checkDbRetry PARA index.js
export async function checkDbRetry(maxRetries = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const [rows] = await pool.query("SELECT 1");
      console.log("Conexión correcta a la DB");
      return true;
    } catch (err) {
      console.log(`Intento ${attempt}/${maxRetries} - DB no responde`);
      if (attempt === maxRetries) throw err;
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}
