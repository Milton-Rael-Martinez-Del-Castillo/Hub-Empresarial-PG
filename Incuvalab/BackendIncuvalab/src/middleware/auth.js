const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    // Esta es una versión básica que puedes expandir más adelante
    // cuando integres con el sistema de autenticación
    
    // Por ahora, solo verificamos si hay un header de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false, 
        message: 'Acceso no autorizado. Token no proporcionado.' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, 'tu_clave_secreta_fuerte_para_desarrollo_123');
      req.user = decoded; // Así puedes acceder a req.user en los controladores
    next();
    } catch (err) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token inválido o expirado.' 
      });
    }
  };
  
  module.exports = authMiddleware;
