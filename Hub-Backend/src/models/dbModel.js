const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');
const pool = require('../config/database');
const adminModel = require('./adminModel');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Crear la base de datos si no existe (conexion sin BD seleccionada)
const ensureDatabase = async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
  });
  await conn.query(
    `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await conn.end();
};

// Migracion: si la tabla admin_usuario todavia tiene la columna 'usuario'
// (esquema anterior), se recrea con el nuevo esquema. Hoy solo contiene
// el administrador por defecto, asi que no hay riesgo de perder datos.
const migrateAdminUsuarioSchema = async () => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS total FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'admin_usuario' AND COLUMN_NAME = 'usuario'`,
    [process.env.DB_DATABASE]
  );
  if (rows[0].total > 0) {
    await pool.query('DROP TABLE IF EXISTS admin_usuario');
    console.log('admin_usuario: esquema antiguo detectado, tabla recreada');
  }
};

// Crear tablas necesarias si no existen
const initializeTables = async () => {
  try {
    await ensureDatabase();
    await migrateAdminUsuarioSchema();

    // 1. Usuarios del Hub (solo rol admin por ahora)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_usuario (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        correo VARCHAR(150) NOT NULL UNIQUE,
        contrasena VARCHAR(255) NOT NULL,
        rol VARCHAR(50) NOT NULL DEFAULT 'Administrador',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Solicitudes de asesoria NAE
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nae_solicitudes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        correo VARCHAR(150) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Solicitudes de desarrollo UMA
    await pool.query(`
      CREATE TABLE IF NOT EXISTS uma_solicitudes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        correo VARCHAR(150) NOT NULL,
        mensaje TEXT DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. Casos de exito NAE (carrusel editable desde el admin)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS nae_casos_exito (
        id INT AUTO_INCREMENT PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT NOT NULL,
        imagen_url VARCHAR(500) DEFAULT NULL,
        orden INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await ensureDefaultAdmin();
    await seedNaeCases();

    console.log('Tablas del Hub Empresarial inicializadas correctamente');
  } catch (error) {
    console.error('Error inicializando tablas del Hub:', error);
    throw error;
  }
};

// Poblar la tabla de casos NAE con los casos por defecto solo si esta vacia
const seedNaeCases = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM nae_casos_exito');
  if (rows[0].total > 0) return;

  const defaults = [
    { titulo: 'Proyecto Destacado 1', descripcion: 'Optimizamos procesos mediante estrategias de gestión avanzada y mentoría especializada.', imagen_url: null, orden: 1 },
    { titulo: 'Proyecto Destacado 2', descripcion: 'Optimizamos procesos mediante estrategias de gestión avanzada y mentoría especializada.', imagen_url: null, orden: 2 },
    { titulo: 'Proyecto Destacado 3', descripcion: 'Optimizamos procesos mediante estrategias de gestión avanzada y mentoría especializada.', imagen_url: null, orden: 3 }
  ];

  for (const caso of defaults) {
    await pool.query(
      'INSERT INTO nae_casos_exito (titulo, descripcion, imagen_url, orden) VALUES (?, ?, ?, ?)',
      [caso.titulo, caso.descripcion, caso.imagen_url, caso.orden]
    );
  }

  console.log('Casos de exito NAE por defecto creados');
};

// Crear el administrador por defecto solo si la tabla esta vacia
const ensureDefaultAdmin = async () => {
  const [rows] = await pool.query('SELECT COUNT(*) AS total FROM admin_usuario');
  if (rows[0].total > 0) return;

  const nombre = process.env.ADMIN_DEFAULT_NAME || 'Administrador Univalle';
  const correo = process.env.ADMIN_DEFAULT_EMAIL || 'admin@univalle.edu';
  const password = process.env.ADMIN_DEFAULT_PASSWORD || 'Univalle1234!';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  await adminModel.insertAdmin({ nombre, correo, contrasena: hashedPassword, rol: 'Administrador' });

  console.log(`Administrador por defecto creado: ${correo}`);
};

module.exports = {
  initializeTables,
  ensureDatabase,
  ensureDefaultAdmin
};