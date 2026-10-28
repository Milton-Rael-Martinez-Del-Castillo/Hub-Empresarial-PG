import React from 'react';

// Componente que muestra el banner principal del curso con información destacada
const CourseHero = ({ course }) => {
  if (!course) return null;

  return (
    <div 
      className="relative h-80 md:h-96 bg-cover bg-center bg-gray-800" 
      style={{ backgroundImage: `url(${course.image_url})` }}
    >
      {/* Overlay para mejorar legibilidad del texto sobre la imagen */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30">
        <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
          {/* Logo del proveedor */}
          <div className="mb-4">
            <img 
              src={course.logo_url} 
              alt={`${course.provider} logo`} 
              className="h-10 sm:h-12 object-contain bg-white/90 p-1 rounded"
            />
          </div>
          
          {/* Título del curso */}
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 max-w-4xl">
            {course.title}
          </h1>
          
          {/* Información del proveedor y escuela */}
          <div className="text-white/90 mb-6">
            <span>Ofrecido por: </span>
            <strong className="font-medium">{course.provider}</strong>
            {course.school_name && (
              <span className="ml-2">- {course.school_name}</span>
            )}
          </div>
          
          {/* Estadísticas del curso */}
          <div className="flex flex-wrap items-center text-white/80 text-sm mb-6 gap-4">
            {course.rating && (
              <div className="flex items-center">
                <span className="flex items-center mr-1">
                  {/* Estrellas basadas en rating */}
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill={i < Math.floor(course.rating) ? "currentColor" : "none"}
                      stroke="currentColor"
                      className={`w-4 h-4 ${i < Math.floor(course.rating) ? "text-yellow-400" : "text-gray-400"}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  ))}
                </span>
                <span>
                  {typeof course.rating === "number"
                    ? course.rating.toFixed(1)
                    : course.rating
                    ? Number(course.rating).toFixed(1)
                    : "Sin calificación"}
                </span>
              </div>
            )}
            
            {course.enrollment_count > 0 && (
              <div>
                <span>{new Intl.NumberFormat().format(course.enrollment_count)} estudiantes inscritos</span>
              </div>
            )}
            
            {course.level && (
              <div className="bg-white/20 px-2 py-0.5 rounded text-white">
                {course.level}
              </div>
            )}
          </div>
          
          {/* Botón de inscripción */}
          <button className="bg-[#8B0D37] hover:bg-[#6E0B2A] text-white font-medium py-3 px-6 rounded-md transition duration-200 w-full sm:w-auto max-w-xs">
            Inscríbete Ahora
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseHero;