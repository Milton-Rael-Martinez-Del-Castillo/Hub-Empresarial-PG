const express = require('express');
const externosController = require('../controllers/externosController');
const auth = require('../middleware/auth');

const router = express.Router();

// Vistas solo-lectura de otros modulos (solo admin autenticado)
router.get('/mentores', auth, externosController.listarMentores);
router.get('/proyectos-crowdfunding', auth, externosController.listarProyectosCrowdfunding);

module.exports = router;