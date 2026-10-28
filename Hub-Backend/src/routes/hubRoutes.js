const express = require('express');
const hubController = require('../controllers/hubController');

const router = express.Router();

// Inicio de sesion del administrador del Hub
router.post('/login', hubController.login);

// Verificacion de sesion activa
router.get('/verify-auth', hubController.verifyAuth);

module.exports = router;