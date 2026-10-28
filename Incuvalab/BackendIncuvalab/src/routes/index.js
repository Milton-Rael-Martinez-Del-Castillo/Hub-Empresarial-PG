const express = require('express');
const moocRoutes = require('./moocRoutes');

const router = express.Router();

router.use('/moocs', moocRoutes);

// Ruta de prueba/salud
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API funcionando correctamente' });
});

module.exports = router;