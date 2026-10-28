const express = require('express');
const moocController = require('../controllers/moocController');
const authMiddleware = require('../middleware/auth');
const authMentor = require('../middleware/authMentor');

const router = express.Router();

// Rutas públicas
router.get('/categories', moocController.getCategories);
router.get('/courses/:id/slides', moocController.getSlidesByCourseId);
router.get('/courses/:id', moocController.getCourseById);
router.get('/subjects', moocController.getSubjects);
router.get('/schools', moocController.getSchools);
router.get('/all-courses', moocController.getAllCourses);
router.get('/courses/:category', moocController.getCoursesByCategory);

// Rutas protegidas (requieren autenticación)
router.post('/courses', authMentor, moocController.createCourse);
router.put('/courses/:id', authMiddleware, moocController.updateCourse);
router.delete('/courses/:id', authMiddleware, moocController.deleteCourse);
router.get('/my-courses', authMentor, moocController.getMyCourses);

module.exports = router;