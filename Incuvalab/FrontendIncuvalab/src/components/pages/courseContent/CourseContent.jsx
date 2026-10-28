import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Clock,
  Star,
  CheckCircle2,
  BookOpen,
  ExternalLink,
  Award,
  Globe,
} from "lucide-react";
import "../Moocs/transitions.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import Quiz from "./components/Quiz.jsx";
import Resources from "./components/Resources.jsx";
import Sidebar from "./components/Sidebar.jsx";
import SlideContent from "./components/SlideContent.jsx";
import VideoPlayer from "./components/VideoPlayer.jsx";
import { fetchSlidesByCourseId, fetchCourseById } from "../../../services/api";

// Componente de Loading mejorado
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B0D37] mx-auto mb-4"></div>
      <p className="text-slate-600 font-medium">Cargando curso...</p>
      <p className="text-sm text-slate-500 mt-1">Preparando el contenido para ti</p>
    </div>
  </div>
);

// Componente de Error mejorado
const ErrorState = ({ message }) => (
  <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <Card className="max-w-md mx-auto shadow-lg">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <X className="h-8 w-8 text-red-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 mb-2">¡Oops! Algo salió mal</h3>
        <p className="text-slate-600 mb-4">{message}</p>
        <Button 
          className="bg-[#8B0D37] hover:bg-[#6E0B2A]" 
          onClick={() => window.location.reload()}
        >
          Intentar de nuevo
        </Button>
      </CardContent>
    </Card>
  </div>
);

const CourseContent = () => {
  const { courseId } = useParams();
  const [slides, setSlides] = useState([]);
  const [course, setCourse] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [slidesData, courseData] = await Promise.all([
          fetchSlidesByCourseId(courseId),
          fetchCourseById(courseId),
        ]);
        setSlides(slidesData);
        setCourse(courseData);
        setCurrentSlide(0);
      } catch (error) {
        console.error("Error loading course data:", error);
        setSlides([]);
        setCourse(null);
      }
      setLoading(false);
    };
    loadData();
  }, [courseId]);

  // Scroll automático al cambiar de slide
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentSlide]);

  if (loading) return <LoadingSpinner />;
  if (!course) return <ErrorState message="Curso no encontrado" />;
  if (!slides.length) return <ErrorState message="Este curso aún no tiene lecciones disponibles." />;

  const slide = slides[currentSlide];
  const totalSlides = slides.length;
  const progress = ((currentSlide + 1) / totalSlides) * 100;

  return (
    <div className="flex bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Botón hamburguesa para móvil */}
      <Button
        variant="default"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-30 bg-[#8B0D37] hover:bg-[#6E0B2A] shadow-lg"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Sidebar */}
      <Sidebar
        slides={slides}
        currentSlide={currentSlide}
        setCurrentSlide={setCurrentSlide}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        course={course}
      />

      {/* Área principal */}
      <main className="flex-1 md:ml-0">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Header con información del curso */}
          <Card className="mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="bg-[#F8E6ED] text-[#8B0D37]">
                      {course.category || "Curso"}
                    </Badge>
                    {course.level && <Badge variant="outline">{course.level}</Badge>}
                    {course.is_popular && (
                      <Badge className="bg-yellow-100 text-yellow-800">Popular</Badge>
                    )}
                    {course.is_new && (
                      <Badge className="bg-green-100 text-green-800">Nuevo</Badge>
                    )}
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">{course.title}</h1>
                  <h2 className="text-lg lg:text-xl text-slate-700 font-medium">{slide.title}</h2>
                  {/* ✅ CORREGIDO: Solo un div, sin duplicación */}
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-4 w-4" />
                      Lección {currentSlide + 1} de {totalSlides}
                    </span>
                    {course.provider && (
                      <>
                        <Separator orientation="vertical" className="h-4" />
                        <span>Por {course.provider}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-3 lg:min-w-[300px]">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Progreso del curso</span>
                    <span className="font-medium text-[#8B0D37]">{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />

                  {/* Estadísticas del curso */}
                  <div className="grid grid-cols-2 gap-4 text-xs text-slate-500">
                    {course.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{course.duration}</span>
                      </div>
                    )}
                    {course.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{course.rating}</span>
                      </div>
                    )}
                    {course.language && (
                      <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>{course.language}</span>
                      </div>
                    )}
                    {course.has_certificate && (
                      <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        <span>Certificado</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contenido del slide */}
          <div className="space-y-6">
            {/* Video */}
            {slide.videoUrl && (
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <VideoPlayer videoUrl={slide.videoUrl} title={slide.title} />
                </CardContent>
              </Card>
            )}

            {/* Presentación embebida */}
            {slide.embedUrl && (
              <Card className="overflow-hidden shadow-lg">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ExternalLink className="h-5 w-5 text-[#8B0D37]" />
                    Presentación
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 pb-6 px-6">
                  <div className="aspect-video rounded-lg overflow-hidden bg-slate-100 shadow-inner">
                    <iframe
                      src={slide.embedUrl}
                      title="Presentación embebida"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      allowFullScreen
                      className="rounded-lg"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contenido de texto */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <SlideContent title={slide.title} content={slide.content} />
              </CardContent>
            </Card>

            {/* Quiz */}
            {slide.quiz && slide.quiz.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <Quiz quiz={slide.quiz} />
                </CardContent>
              </Card>
            )}

            {/* Recursos */}
            {slide.resources && slide.resources.length > 0 && (
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <Resources resources={slide.resources} />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Navegación entre lecciones */}
          <Card className="mt-8 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentSlide((prev) => Math.max(prev - 1, 0))}
                  disabled={currentSlide === 0}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Lección anterior
                </Button>

                <div className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
                  <span>
                    Lección {currentSlide + 1} de {totalSlides}
                  </span>
                </div>

                <Button
                  onClick={() => setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1))}
                  disabled={currentSlide === totalSlides - 1}
                  className="bg-[#8B0D37] hover:bg-[#6E0B2A] flex items-center gap-2"
                >
                  {currentSlide === totalSlides - 1 ? (
                    <>
                      Finalizar curso
                      <CheckCircle2 className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Siguiente lección
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Link al CourseBuilder */}
          <div className="mt-6 text-center">
            <Button variant="outline" asChild className="shadow-md">
              <a
                href="/course-builder"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <ExternalLink className="h-4 w-4" />
                Ver panel de creación (CourseBuilder)
              </a>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseContent;