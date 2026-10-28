const express = require('express');
const hubRoutes = require('./hubRoutes');
const naeRoutes = require('./naeRoutes');
const umaRoutes = require('./umaRoutes');
const externosRoutes = require('./externosRoutes');

const router = express.Router();

// Ruta de prueba/salud
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API del Hub Empresarial funcionando correctamente' });
});

// Administradores del Hub: login y verificacion de sesion
router.use('/hub', hubRoutes);

// Vistas solo-lectura de otros modulos (protegidas por JWT admin)
router.use('/hub', externosRoutes);

// Solicitudes NAE
router.use('/nae', naeRoutes);

// Solicitudes UMA
router.use('/uma', umaRoutes);

module.exports = router;