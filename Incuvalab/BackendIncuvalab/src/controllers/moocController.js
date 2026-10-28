const moocModel = require('../models/moocModel');

// Inicializar tablas
const initializeTables = async (req, res, next) => {
  try {
    await moocModel.initializeTables();
    res.status(200).json({
      success: true,
      message: 'Tablas MOOC inicializadas correctamente'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener categorías
const getCategories = async (req, res, next) => {
  try {
    const categories = await moocModel.getCategories();
    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// Obtener cursos por categoría
const getCoursesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    
    let courses;
    
    // Categorías especiales
    if (category === 'popular') {
      courses = await moocModel.getPopularCourses();
    } else if (category === 'new') {
      courses = await moocModel.getNewCourses();
    } else if (category === 'trending') {
      courses = await moocModel.getTrendingCourses();
    } else {
      courses = await moocModel.getCoursesByCategory(category);
    }
    
    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// Obtener temas/materias
const getSubjects = async (req, res, next) => {
  try {
    const subjects = await moocModel.getSubjects();
    res.status(200).json({
      success: true,
      data: subjects
    });
  } catch (error) {
    next(error);
  }
};

// Obtener escuelas con sus materias
const getSchools = async (req, res, next) => {
  try {
    const schools = await moocModel.getSchools();
    res.status(200).json({
      success: true,
      data: schools
    });
  } catch (error) {
    next(error);
  }
};

// Crear un nuevo curso
const createCourse = async (req, res, next) => {
  try {
    const courseData = req.body;
    
    // Validación básica
    const requiredFields = ['title', 'provider', 'image_url', 'logo_url', 'type', 'category'];
    for (const field of requiredFields) {
      if (!courseData[field]) {
      return res.status(400).json({
        success: false,
          message: `El campo ${field} es obligatorio`
      });
    }
    }
    
    // Validaciones adicionales (ejemplo: tipo de datos, formato de fechas, etc.)
    
    const courseId = await moocModel.createCourse({
      ...courseData,
      mentor_id: req.user.id // Enlazar curso al mentor (usuario)
    });
    
    res.status(201).json({
      success: true,
      message: 'Curso creado exitosamente',
      data: { id: courseId }
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar un curso existente
const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const courseData = req.body;
    
    // Validación básica
    if (!courseData.title || !courseData.provider || !courseData.image_url || 
        !courseData.logo_url || !courseData.type || !courseData.category) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos obligatorios'
      });
    }
    
    const success = await moocModel.updateCourse(id, courseData);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Curso actualizado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un curso
const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const success = await moocModel.deleteCourse(id);
    
    if (!success) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Curso eliminado exitosamente'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener todos los cursos agrupados por categoría
const getAllCourses = async (req, res, next) => {
  try {
    // Obtener todas las categorías
    const categories = await moocModel.getCategories();
    
    // Objeto para almacenar resultados
    const result = {
      categories: categories,
      coursesByCategory: {},
      specialCategories: {
        popular: [],
        new: [],
        trending: []
      }
    };
    
    // Obtener cursos para cada categoría
    for (const cat of categories) {
      const categoryName = cat.category;
      const courses = await moocModel.getCoursesByCategory(categoryName);

      // Verificar si subject_ids está presente
      console.log(`Categoría ${categoryName}, primer curso:`, 
        courses.length > 0 ? {
          id: courses[0].id,
          title: courses[0].title,
          subject_ids: courses[0].subject_ids
        } : 'No hay cursos');


      result.coursesByCategory[categoryName] = courses;
    }
    
    // Obtener cursos especiales
    result.specialCategories.popular = await moocModel.getPopularCourses();
    result.specialCategories.new = await moocModel.getNewCourses();
    result.specialCategories.trending = await moocModel.getTrendingCourses();
    
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Obtener un curso por ID
const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await moocModel.getCourseById(id);
    console.log("Resultado del modelo getCourseById:", course); // <-- Agrega esto
    if (!course) {
      return res.status(404).json({ success: false, message: "Curso no encontrado" });
    }
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};



// Obtener slides por ID de curso
const getSlidesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params;
    const slides = await moocModel.getSlidesByCourseId(id);
    res.status(200).json({ success: true, data: slides });
  } catch (error) {
    console.error("Error en getSlidesByCourseId:", error);
    next(error);
  }
};

// Obtener los cursos creados por el mentor autenticado
const getMyCourses = async (req, res, next) => {
  try {
    const mentorId = req.user.id;
    if (!mentorId) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }
    const myCourses = await moocModel.getCoursesByMentorId(mentorId);
    res.status(200).json({ success: true, data: myCourses });
  } catch (error) {
    next(error);
  }
};

// Actualizar module.exports para incluir getAllCourses
module.exports = {
  initializeTables,
  getCategories,
  getCoursesByCategory,
  getSubjects,
  getSchools,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getSlidesByCourseId,
  getMyCourses,
};