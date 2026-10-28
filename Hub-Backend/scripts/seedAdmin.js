// Script para crear/reiniciar el administrador por defecto del Hub Empresarial
// Uso: npm run seed
const bcrypt = require('bcryptjs');
const pool = require('../src/config/database');
const dbModel = require('../src/models/dbModel');
const adminModel = require('../src/models/adminModel');

(async () => {
  try {
    await dbModel.initializeTables();

    const nombre = process.env.ADMIN_DEFAULT_NAME || 'Administrador Univalle';
    const correo = process.env.ADMIN_DEFAULT_EMAIL || 'admin@univalle.edu';
    const password = process.env.ADMIN_DEFAULT_PASSWORD || 'Univalle1234!';

    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM admin_usuario');
    if (rows[0].total > 0) {
      console.log('El administrador por defecto ya existe en la base de datos.');
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      await adminModel.insertAdmin({ nombre, correo, contrasena: hashedPassword, rol: 'Administrador' });
      console.log(`Administrador creado -> ${correo} (${nombre})`);
    }

    process.exit(0);
  } catch (error) {
    console.error('Error en seed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();