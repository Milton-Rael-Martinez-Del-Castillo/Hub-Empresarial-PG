const jwt = require('jsonwebtoken');

const authMentorOrAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'tu_clave_secreta_fuerte_para_desarrollo_123');
    if (decoded.rol === 'Mentor' || decoded.rol === 'Administrador') {
      req.user = decoded;
      return next();
    }
    return res.status(403).json({ message: 'Solo mentores o administradores pueden realizar esta acción' });
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

module.exports = authMentorOrAdmin; 