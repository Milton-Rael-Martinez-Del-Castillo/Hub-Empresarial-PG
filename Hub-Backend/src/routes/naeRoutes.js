const express = require('express');
const auth = require('../middleware/auth');
const naeController = require('../controllers/naeController');

const router = express.Router();

// Publico: enviar solicitud de asesoria NAE
router.post('/solicitudes', naeController.submitSolicitud);

// Publico: listar casos de exito NAE
router.get('/casos', naeController.getCasos);

// Protegido (solo admin con JWT)
router.get('/solicitudes', auth, naeController.getSolicitudes);
router.delete('/solicitudes/:id', auth, naeController.deleteSolicitud);

// CRUD de casos de exito NAE (protegido)
router.post('/casos', auth, naeController.createCaso);
router.put('/casos/:id', auth, naeController.updateCaso);
router.delete('/casos/:id', auth, naeController.deleteCaso);

module.exports = router;