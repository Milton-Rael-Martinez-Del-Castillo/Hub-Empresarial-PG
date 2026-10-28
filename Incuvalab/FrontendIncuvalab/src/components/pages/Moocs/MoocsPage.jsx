import React, { useState, useEffect } from "react";
import "./transitions.css"; // Importar el CSS de transición
import "../../../styles/accessibility.css"; // Importar estilos de accesibilidad
import HeroSearch from "./HeroSearch";
import CourseCategory from "./CourseCategory";
import FilterSection from "./FilterSection";
import EmptyState from "./EmptyState"; // Nuevo componente
import {
  fetchAllMoocsData,
  fetchSubjects,
  fetchSchools,
} from "../../../services/api";
import LoadingSpinner from "../../LoadingSpinner";

const STORAGE_KEYS = {
  SUBJECT_FILTERS: "moocs_subject_filters",
  SCHOOL_FILTER: "moocs_school_filter",
  LAST_SEARCH: "moocs_last_search",
};

const MoocsPage = () => {
  // Estados para datos
  const [categories, setCategories] = useState([]);
  const [coursesByCategory, setCoursesByCategory] = useState({});
  const [originalCoursesByCategory, setOriginalCoursesByCategory] = useState(
    {}
  );
  const [specialCourses, setSpecialCourses] = useState({
    popular: [],
    new: [],
    trending: [],
  });
  const [originalSpecialCourses, setOriginalSpecialCourses] = useState({
    popular: [],
    new: [],
    trending: [],
  });
  const [subjects, setSubjects] = useState([]);
  const [schools, setSchools] = useState([]);

  // Estados de carga mejorados para diferentes secciones
  const [loadingStates, setLoadingStates] = useState({
    courses: true,
    subjects: true,
    schools: true,
    filtering: false,
    searching: false, // Añadir esta línea
  });
  // Estados para búsqueda
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Estados de error mejorados
  const [errorStates, setErrorStates] = useState({
    courses: null,
    subjects: null,
    schools: null,
    filtering: null,
    searching: null, // Añadir esta línea
  });

  // Estados para filtros
  const [activeSubjectFilters, setActiveSubjectFilters] = useState([]);
  const [activeSchoolFilter, setActiveSchoolFilter] = useState(null);
  // Estado para controlar si hay resultados después de filtrar
  const [hasFilteredResults, setHasFilteredResults] = useState(true);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      // Reiniciar errores
      setErrorStates({
        courses: null,
        subjects: null,
        schools: null,
        filtering: null,
        searching: null,
      });

      try {
        // Iniciar carga de cursos
        setLoadingStates((prev) => ({ ...prev, courses: true }));
        const allData = await fetchAllMoocsData();

        setCategories(allData.categories);
        setCoursesByCategory(allData.coursesByCategory);
        setOriginalCoursesByCategory(allData.coursesByCategory);
        setSpecialCourses(allData.specialCategories);
        setOriginalSpecialCourses(allData.specialCategories);
        setLoadingStates((prev) => ({ ...prev, courses: false }));
      } catch (err) {
        console.error("Error cargando cursos:", err);
        setErrorStates((prev) => ({
          ...prev,
          courses: "Error cargando cursos. Por favor, intenta nuevamente.",
        }));
        setLoadingStates((prev) => ({ ...prev, courses: false }));
      }

      try {
        // Iniciar carga de materias
        setLoadingStates((prev) => ({ ...prev, subjects: true }));
        const subjectsData = await fetchSubjects();
        setSubjects(subjectsData);
        setLoadingStates((prev) => ({ ...prev, subjects: false }));
      } catch (err) {
        console.error("Error cargando materias:", err);
        setErrorStates((prev) => ({
          ...prev,
          subjects: "Error cargando materias. Por favor, intenta nuevamente.",
        }));
        setLoadingStates((prev) => ({ ...prev, subjects: false }));
      }

      try {
        // Iniciar carga de escuelas
        setLoadingStates((prev) => ({ ...prev, schools: true }));
        const schoolsData = await fetchSchools();
        setSchools(schoolsData);
        setLoadingStates((prev) => ({ ...prev, schools: false }));
      } catch (err) {
        console.error("Error cargando escuelas:", err);
        setErrorStates((prev) => ({
          ...prev,
          schools: "Error cargando escuelas. Por favor, intenta nuevamente.",
        }));
        setLoadingStates((prev) => ({ ...prev, schools: false }));
      }
    };

    loadData();
  }, []);

  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    if (loadingStates.courses) return;

    try {
      // Indicador visual de que se están aplicando filtros
      setLoadingStates((prev) => ({ ...prev, filtering: true }));

      // Si no hay filtros activos, restaurar datos originales
      if (activeSubjectFilters.length === 0 && !activeSchoolFilter) {
        setCoursesByCategory(originalCoursesByCategory);
        setSpecialCourses(originalSpecialCourses);
        setHasFilteredResults(true);
        setLoadingStates((prev) => ({ ...prev, filtering: false }));
        return;
      }

      // Función para verificar si un curso cumple con los filtros
      const matchesFilters = (course) => {
        let matchesSubject = true;
        let matchesSchool = true;

        // Verificar filtro de materias si está activo
        if (activeSubjectFilters.length > 0) {
          const courseSubjects = course.subject_ids || [];
          matchesSubject = activeSubjectFilters.some((id) =>
            courseSubjects.includes(id)
          );
        }

        // Verificar filtro de escuela si está activo
        if (activeSchoolFilter) {
          matchesSchool = course.school_id === activeSchoolFilter;
        }

        return matchesSubject && matchesSchool;
      };

      // Filtrar cursos por categoría
      const filteredCoursesByCategory = {};
      Object.keys(originalCoursesByCategory).forEach((category) => {
        filteredCoursesByCategory[category] =
          originalCoursesByCategory[category].filter(matchesFilters);
      });

      // Filtrar cursos especiales
      const filteredSpecialCourses = {
        popular: originalSpecialCourses.popular.filter(matchesFilters),
        new: originalSpecialCourses.new.filter(matchesFilters),
        trending: originalSpecialCourses.trending.filter(matchesFilters),
      };

      // Verificar si hay resultados después de filtrar
      const totalCoursesFiltered =
        Object.values(filteredCoursesByCategory).flat().length +
        filteredSpecialCourses.popular.length +
        filteredSpecialCourses.new.length +
        filteredSpecialCourses.trending.length;

      setHasFilteredResults(totalCoursesFiltered > 0);
      setCoursesByCategory(filteredCoursesByCategory);
      setSpecialCourses(filteredSpecialCourses);
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
      setErrorStates((prev) => ({
        ...prev,
        filtering: "Error al aplicar filtros.",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, filtering: false }));
    }
  }, [
    activeSubjectFilters,
    activeSchoolFilter,
    loadingStates.courses,
    originalCoursesByCategory,
    originalSpecialCourses,
  ]);

  // Añadir este efecto después de los useEffect existentes
  useEffect(() => {
    // Recuperar filtros guardados al iniciar
    try {
      // Cargar filtros de materias
      const savedSubjectFilters = localStorage.getItem(
        STORAGE_KEYS.SUBJECT_FILTERS
      );
      if (savedSubjectFilters) {
        setActiveSubjectFilters(JSON.parse(savedSubjectFilters));
      }

      // Cargar filtro de escuela
      const savedSchoolFilter = localStorage.getItem(
        STORAGE_KEYS.SCHOOL_FILTER
      );
      if (savedSchoolFilter) {
        setActiveSchoolFilter(JSON.parse(savedSchoolFilter));
      }
    } catch (error) {
      console.error("Error al cargar preferencias guardadas:", error);
      // Si hay error, limpiar localStorage para evitar problemas futuros
      localStorage.removeItem(STORAGE_KEYS.SUBJECT_FILTERS);
      localStorage.removeItem(STORAGE_KEYS.SCHOOL_FILTER);
    }
  }, []); // Solo se ejecuta al montar el componente

  // Efecto para guardar cambios en filtros de materias
  useEffect(() => {
    if (activeSubjectFilters.length > 0) {
      localStorage.setItem(
        STORAGE_KEYS.SUBJECT_FILTERS,
        JSON.stringify(activeSubjectFilters)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.SUBJECT_FILTERS);
    }
  }, [activeSubjectFilters]);

  // Efecto para guardar cambios en filtro de escuela
  useEffect(() => {
    if (activeSchoolFilter) {
      localStorage.setItem(
        STORAGE_KEYS.SCHOOL_FILTER,
        JSON.stringify(activeSchoolFilter)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.SCHOOL_FILTER);
    }
  }, [activeSchoolFilter]);

  // Manejador para cambios en filtros de materias
  const handleSubjectFilterChange = (selectedSubjects) => {
    setActiveSubjectFilters(selectedSubjects);
  };

  // Manejador para cambios en filtros de escuelas
  const handleSchoolFilterChange = (selectedSchool) => {
    setActiveSchoolFilter(selectedSchool.length > 0 ? selectedSchool[0] : null);
  };

  // Manejador para reintentar carga
  const handleRetry = (section) => {
    // Reiniciar el error específico
    setErrorStates((prev) => ({ ...prev, [section]: null }));

    // Realizar la carga de datos nuevamente
    const loadData = async () => {
      try {
        setLoadingStates((prev) => ({ ...prev, [section]: true }));

        if (section === "courses") {
          const allData = await fetchAllMoocsData();
          setCategories(allData.categories);
          setCoursesByCategory(allData.coursesByCategory);
          setOriginalCoursesByCategory(allData.coursesByCategory);
          setSpecialCourses(allData.specialCategories);
          setOriginalSpecialCourses(allData.specialCategories);
        } else if (section === "subjects") {
          const subjectsData = await fetchSubjects();
          setSubjects(subjectsData);
        } else if (section === "schools") {
          const schoolsData = await fetchSchools();
          setSchools(schoolsData);
        }

        setLoadingStates((prev) => ({ ...prev, [section]: false }));
      } catch (err) {
        console.error(`Error al reintentar carga de ${section}:`, err);
        setErrorStates((prev) => ({
          ...prev,
          [section]: `Error cargando ${section}. Por favor, intenta nuevamente.`,
        }));
        setLoadingStates((prev) => ({ ...prev, [section]: false }));
      }
    };

    loadData();
  };

  // Función para manejar la búsqueda
  const handleSearch = (term) => {
    if (!term.trim()) {
      setShowSearchResults(false);
      localStorage.removeItem(STORAGE_KEYS.LAST_SEARCH); // Limpiar última búsqueda
      return;
    }

    setSearchTerm(term);
    localStorage.setItem(STORAGE_KEYS.LAST_SEARCH, term); // Guardar búsqueda
    setLoadingStates((prev) => ({ ...prev, searching: true }));
    setShowSearchResults(true);

    try {
      // Obtener todos los cursos de todas las categorías y cursos especiales
      const allCourses = [
        ...Object.values(originalCoursesByCategory).flat(),
        ...originalSpecialCourses.popular,
        ...originalSpecialCourses.new,
        ...originalSpecialCourses.trending,
      ];

      // Eliminar duplicados (en caso de que un curso aparezca en múltiples categorías)
      const uniqueCourses = Array.from(
        new Map(allCourses.map((course) => [course.id, course])).values()
      );

      // Filtrar cursos basados en el término de búsqueda
      const termLower = term.toLowerCase();
      const results = uniqueCourses.filter((course) => {
        // Buscar en múltiples campos
        return (
          (course.title && course.title.toLowerCase().includes(termLower)) ||
          (course.provider &&
            course.provider.toLowerCase().includes(termLower)) ||
          (course.type && course.type.toLowerCase().includes(termLower)) ||
          // También buscar en las materias del curso si están disponibles
          (course.subject_ids &&
            subjects.some(
              (subject) =>
                course.subject_ids.includes(subject.id) &&
                subject.name.toLowerCase().includes(termLower)
            ))
        );
      });

      setSearchResults(results);
    } catch (error) {
      console.error("Error durante la búsqueda:", error);
      setErrorStates((prev) => ({
        ...prev,
        searching: "Error al realizar la búsqueda.",
      }));
    } finally {
      setLoadingStates((prev) => ({ ...prev, searching: false }));
    }
  };

  // Función para limpiar todas las preferencias
  const clearAllPreferences = () => {
    localStorage.removeItem(STORAGE_KEYS.SUBJECT_FILTERS);
    localStorage.removeItem(STORAGE_KEYS.SCHOOL_FILTER);
    localStorage.removeItem(STORAGE_KEYS.LAST_SEARCH);
    setActiveSubjectFilters([]);
    setActiveSchoolFilter(null);
    clearSearch(); // Usa la función existente para limpiar la búsqueda de manera consistente
  };

  // Función para limpiar los resultados de búsqueda
  const clearSearch = () => {
    setSearchTerm("");
    setShowSearchResults(false);
    setSearchResults([]);
    localStorage.removeItem(STORAGE_KEYS.LAST_SEARCH); // Asegurarse de que la búsqueda se elimine del localStorage
  };

  // Renderizado principal ajustado para mostrar estados específicos
  return (
    <div className="min-h-screen bg-white page-transition">
      {/* Skip link para accesibilidad */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:p-4 focus:bg-blue-500 focus:text-white focus:z-50"
      >
        Saltar al contenido principal
      </a>

      <header role="banner">
        <HeroSearch onSearch={handleSearch} />
      </header>

      <main id="main-content" role="main">
        {/* Error global para búsqueda */}
        {errorStates.searching && (
          <div className="text-center py-4" role="alert" aria-live="assertive">
            <p className="text-red-600 mb-2">{errorStates.searching}</p>
            <button
              onClick={() =>
                setErrorStates((prev) => ({ ...prev, searching: null }))
              }
              className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cerrar
            </button>
          </div>
        )}

        {/* Indicador de búsqueda en progreso */}
        {loadingStates.searching && (
          <div className="py-10 fade-in">
            <LoadingSpinner message={`Buscando "${searchTerm}"...`} />
          </div>
        )}

        {/* Sección de resultados de búsqueda */}
        {showSearchResults && !loadingStates.searching && (
          <div className="max-w-[1200px] mx-auto px-4 py-4 md:py-8 fade-in">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 md:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0 slide-in">
                Resultados para "{searchTerm}" ({searchResults.length})
              </h2>
              <button
                onClick={clearSearch}
                className="self-start sm:self-auto px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm transition-colors scale-hover focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Limpiar búsqueda
              </button>
            </div>

            {/* Grid responsivo para resultados de búsqueda */}
            {searchResults.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {searchResults.map((course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 card-hover slide-in"
                  >
                    <div className="h-40 relative overflow-hidden">
                      <img
                        src={course.image_url}
                        alt={course.title}
                        className="w-full h-full object-cover img-zoom"
                      />
                      <div className="absolute top-0 left-0 p-2">
                        <img
                          src={course.logo_url}
                          alt={course.provider}
                          className="h-8 w-auto"
                        />
                      </div>
                    </div>
                    <div className="p-4">
                      <h3
                        className="font-semibold text-lg mb-1 line-clamp-2"
                        title={course.title}
                      >
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-2">
                        {course.provider}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {course.type}
                        </span>
                        {course.course_count && (
                          <span className="text-xs text-gray-500">
                            {course.course_count} cursos
                          </span>
                        )}
                      </div>

                      {/* Mostrar las materias asociadas si existen */}
                      {course.subject_ids && course.subject_ids.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {course.subject_ids.map((subjectId) => {
                            const subject = subjects.find(
                              (s) => s.id === subjectId
                            );
                            return subject ? (
                              <span
                                key={subjectId}
                                className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                              >
                                {subject.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                message="No se encontraron cursos para este término de búsqueda"
                actionText="Intentar con otra búsqueda"
                onAction={clearSearch}
                className="slide-in"
              />
            )}
          </div>
        )}

        {/* Mostrar contenido normal solo si no hay búsqueda activa */}
        {!showSearchResults && (
          <>
            {/* Estado de error global para cursos */}
            {errorStates.courses ? (
              <div className="text-center py-10 fade-in">
                <p className="text-red-600 mb-4">{errorStates.courses}</p>
                <button
                  onClick={() => handleRetry("courses")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 scale-hover"
                >
                  Reintentar
                </button>
              </div>
            ) : loadingStates.courses ? (
              <div className="py-20 fade-in">
                <LoadingSpinner message="Cargando cursos..." />
              </div>
            ) : (
              <>
                {/* Mensaje cuando no hay resultados de filtrado */}
                {!hasFilteredResults &&
                  (activeSubjectFilters.length > 0 || activeSchoolFilter) && (
                    <EmptyState
                      message="No se encontraron cursos con los filtros seleccionados"
                      actionText="Limpiar filtros"
                      onAction={() => {
                        setActiveSubjectFilters([]);
                        setActiveSchoolFilter(null);
                      }}
                    />
                  )}
                {/* Categorías principales - solo si hay resultados */}
                {hasFilteredResults && (
                  <>
                    {/* Indicador de filtrado activo */}
                    {loadingStates.filtering && (
                      <div className="text-center py-4 text-blue-600">
                        <div className="inline-block pulse">
                          Aplicando filtros...
                        </div>
                      </div>
                    )}

                    {/* Categorías de cursos */}
                    {categories.map((category) => {
                      const categoryName = category.category;
                      const categoryCourses =
                        coursesByCategory[categoryName] || [];

                      // Solo mostrar categorías que tengan cursos después de aplicar filtros
                      if (categoryCourses.length === 0) return null;

                      return (
                        <CourseCategory
                          key={category.id || categoryName}
                          title={categoryName}
                          courses={categoryCourses}
                        />
                      );
                    })}
                  </>
                )}
                {/* Filtros por tema */}
                {errorStates.subjects ? (
                  <div className="text-center py-6">
                    <p className="text-red-600 mb-4">{errorStates.subjects}</p>
                    <button
                      onClick={() => handleRetry("subjects")}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Reintentar carga de materias
                    </button>
                  </div>
                ) : loadingStates.subjects ? (
                  <div className="py-8">
                    <LoadingSpinner
                      message="Cargando materias..."
                      size="small"
                    />
                  </div>
                ) : (
                  <FilterSection
                    title="Filter by popular subjects"
                    type="subjects"
                    items={subjects}
                    activeFilters={activeSubjectFilters}
                    onFilterChange={handleSubjectFilterChange}
                  />
                )}
                {/* Cursos especiales - Solo se muestran si hay cursos después de filtrar */}
                {specialCourses.popular.length > 0 && (
                  <CourseCategory
                    title="Explore courses and programs"
                    courses={specialCourses.popular}
                  />
                )}
                {specialCourses.new.length > 0 && (
                  <CourseCategory title="New" courses={specialCourses.new} />
                )}
                {specialCourses.trending.length > 0 && (
                  <CourseCategory
                    title="Trending"
                    courses={specialCourses.trending}
                  />
                )}
                {/* Filtros por escuela */}
                {errorStates.schools ? (
                  <div className="text-center py-6">
                    <p className="text-red-600 mb-4">{errorStates.schools}</p>
                    <button
                      onClick={() => handleRetry("schools")}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Reintentar carga de escuelas
                    </button>
                  </div>
                ) : loadingStates.schools ? (
                  <div className="py-8">
                    <LoadingSpinner
                      message="Cargando escuelas..."
                      size="small"
                    />
                  </div>
                ) : (
                  <FilterSection
                    title="Filter by popular schools and partners"
                    type="schools"
                    items={schools}
                    activeFilters={
                      activeSchoolFilter ? [activeSchoolFilter] : []
                    }
                    onFilterChange={handleSchoolFilterChange}
                  />
                )}

                {/* Botón para limpiar preferencias guardadas */}
                <div className="max-w-[1200px] mx-auto px-4 py-2">
                  <button
                    onClick={clearAllPreferences}
                    className="text-sm text-gray-500 hover:text-gray-700 underline scale-hover"
                  >
                    Restablecer preferencias guardadas
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default MoocsPage;
