import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Moocs/transitions.css";
import CourseHero from "./CourseHero";
import CourseInfoCards from "./CourseInfoCards";
import CourseNavTabs from "./CourseNavTabs";
import CourseOverview from "./Tabs/CourseOverview";
import CourseSyllabus from "./Tabs/CourseSyllabus";
import CourseInstructors from "./Tabs/CourseInstructors";
import CourseEnrollCTA from "./CourseEnrollCTA";
import LoadingSpinner from "../../LoadingSpinner"; // Usar el spinner existente
import { fetchCourseById } from "../../../services/api"; // Ajusta el path si es necesario



const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Estados para datos del curso
  const [courseData, setCourseData] = useState(null);
  const [relatedCourses, setRelatedCourses] = useState([]);

  // Estados para navegación por pestañas
  const [activeTab, setActiveTab] = useState("overview");

  // Estados de carga y error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efecto para cargar datos del curso
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchCourseById(courseId)
      .then((data) => {
        console.log("Datos del curso recuperados:", data); // <-- Depuración
        setCourseData(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("No se pudo cargar el curso.");
        setLoading(false);
      });
  }, [courseId]);

  // Función para renderizar el contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <CourseOverview data={courseData} />;
      case "syllabus":
        return <CourseSyllabus data={courseData} />;
      case "instructors":
        return <CourseInstructors data={courseData} />;
      case "resources":
        return (
          <div className="py-12 text-center text-gray-500">
            Recursos adicionales en desarrollo
          </div>
        );
      case "faq":
        return (
          <div className="py-12 text-center text-gray-500">
            Preguntas frecuentes en desarrollo
          </div>
        );
      default:
        return <CourseOverview data={courseData} />;
    }
  };

  // Renderizado de estados de carga/error
  if (loading) {
    return (
      <div className="py-20">
        <LoadingSpinner message="Cargando detalles del curso..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <div className="text-center bg-red-50 p-6 rounded-lg max-w-lg">
          <h2 className="text-xl font-bold text-red-700 mb-2">
            Error al cargar el curso
          </h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/servicios/moocs")}
            className="px-4 py-2 bg-[#8B0D37] hover:bg-[#6E0B2A] text-white rounded-md transition duration-200"
          >
            Volver a cursos
          </button>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="flex items-center justify-center px-4 py-16">
        <div className="text-center bg-yellow-50 p-6 rounded-lg max-w-lg">
          <h2 className="text-xl font-bold text-yellow-700 mb-2">
            Curso no encontrado
          </h2>
          <p className="text-yellow-600 mb-4">
            No pudimos encontrar el curso que estás buscando.
          </p>
          <button
            onClick={() => navigate("/servicios/moocs")}
            className="px-4 py-2 bg-[#8B0D37] hover:bg-[#6E0B2A] text-white rounded-md transition duration-200"
          >
            Explorar cursos disponibles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      {/* Hero Banner */}
      <CourseHero course={courseData} />

      {/* Contenedor principal */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-12 py-8">
        {/* Tarjetas de información */}
        <CourseInfoCards course={courseData} />

        {/* Navegación por pestañas */}
        <CourseNavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Contenido de la pestaña seleccionada */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-24">
          {renderTabContent()}
          <button
            className="mt-4 px-4 py-2 bg-[#8B0D37] text-white rounded"
            onClick={() => navigate(`/curso/${courseData.id}/contenido`)}
          >
            Ir al contenido del curso (demo)
          </button>
        </div>
      </div>

      {/* Botón flotante de inscripción - Ajustado para dejar espacio al footer */}
      <CourseEnrollCTA course={courseData} />
    </div>
  );
};

export default CourseDetail;
