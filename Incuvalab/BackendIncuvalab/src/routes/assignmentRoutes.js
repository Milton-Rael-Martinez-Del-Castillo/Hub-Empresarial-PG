
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const assignmentController = require('../controllers/assignmentController');
const authMiddleware = require('../middleware/auth');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../Files')); // Guardar en carpeta Files
    },
    filename: (req, file, cb) => {
        // Nombre temporal, luego se renombrará en el controlador con el ID
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'temp-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx|ppt|pptx|mp4/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Formato de archivo no soportado'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
    fileFilter: fileFilter
});

// Rutas
router.get('/mentees', authMiddleware, assignmentController.getMentees);
router.get('/mentee-assignments', authMiddleware, assignmentController.getMenteeAssignments);
router.get('/mentee-assignments/:id', authMiddleware, assignmentController.getAssignmentsByMenteeId);
router.get('/assignments', authMiddleware, assignmentController.getAssignments);
router.get('/assignments/:id/files', authMiddleware, assignmentController.getAssignmentFiles);
router.post('/assignments', authMiddleware, upload.array('files', 10), assignmentController.createAssignment);
router.put('/assignments/:id', authMiddleware, upload.array('files', 10), assignmentController.updateAssignment);
router.post('/assignments/:id/deliver', authMiddleware, upload.array('files', 10), assignmentController.deliverAssignment);
router.delete('/assignments/:id', authMiddleware, assignmentController.deleteAssignment);

module.exports = router;
