const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    const decoded = jwt.verify(token, 'tu_clave_secreta_fuerte_para_desarrollo_123');
    if (decoded.rol !== 'Mentor') {
      return res.status(403).json({ message: 'Solo los mentores pueden acceder a esta función' });
    }

    req.user = decoded; // Solo datos del usuario, sin mentorId
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};
