const express = require('express');
const auth = require('../middleware/auth');
const umaController = require('../controllers/umaController');

const router = express.Router();

// Publico: enviar solicitud UMA
router.post('/solicitudes', umaController.submitSolicitud);

// Protegido (solo admin con JWT)
router.get('/solicitudes', auth, umaController.getSolicitudes);
router.delete('/solicitudes/:id', auth, umaController.deleteSolicitud);

module.exports = router;