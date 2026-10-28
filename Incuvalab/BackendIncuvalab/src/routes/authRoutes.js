const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();


router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE usuario = ?', [email]);
    connection.release();

    if (rows.length === 0) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.contrasena);

    if (!isMatch) return res.status(401).json({ message: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user.id, email: user.usuario, rol: user.rol }, 'tu_clave_secreta_fuerte_para_desarrollo_123', {
      expiresIn: '100y'
    });

    res.json({ user: { id: user.id, email: user.usuario, rol: user.rol }, token });
  } catch (err) {
    res.status(500).json({ message: 'Error en login' });
  }
});


// Verify auth route (existing)
router.get('/verify-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.json({ isAuthenticated: false });

  try {
    const decoded = jwt.verify(token, 'tu_clave_secreta_fuerte_para_desarrollo_123');
    res.json({ isAuthenticated: true, user: { id: decoded.id, email: decoded.email, rol: decoded.rol } });
  } catch {
    res.json({ isAuthenticated: false });
  }
});


// New routes for password reset
router.post('/verify-email', async (req, res) => {
  const { email } = req.body;
  
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.execute('SELECT * FROM usuario WHERE usuario = ?', [email]);
    connection.release();

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No se encontró una cuenta con este correo electrónico' });
    }

    // In a real application, you would send an email with a reset token here
    // For this example, we'll just return a success response
    
    res.json({ 
      success: true,
      message: 'Correo verificado correctamente. Por favor establece una nueva contraseña.'
    });
  } catch (err) {
    console.error('Error verifying email:', err);
    res.status(500).json({ message: 'Error al verificar el correo electrónico' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;
  
  try {
    // Validate password length
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const connection = await pool.getConnection();
    
    // Update password in database
    await connection.execute(
      'UPDATE usuario SET contrasena = ? WHERE usuario = ?',
      [hashedPassword, email]
    );
    
    connection.release();

    res.json({ 
      success: true,
      message: 'Contraseña actualizada exitosamente. Ahora puedes iniciar sesión con tu nueva contraseña.'
    });
  } catch (err) {
    console.error('Error resetting password:', err);
    res.status(500).json({ message: 'Error al restablecer la contraseña' });
  }
});

module.exports = router;

