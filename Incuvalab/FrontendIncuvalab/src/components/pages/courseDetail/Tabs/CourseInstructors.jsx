import React from 'react';

// Datos mock para instructores (normalmente vendría del backend)
const mockInstructors = [
  {
    id: 1,
    name: "David J. Malan",
    title: "Gordon McKay Professor of the Practice of Computer Science",
    bio: "David J. Malan es profesor de Ciencias de la Computación en Harvard University, donde imparte el popular curso CS50. Sus intereses de investigación incluyen ciberseguridad, tecnología digital forense y pedagogía informática. Se graduó de Harvard con un A.B. en Ciencias de la Computación y obtuvo su Ph.D. en la misma área.",
    image_url: "../../david.jpg",
    institution: "Harvard University",
    credentials: "Ph.D. in Computer Science, Harvard University",
    mentor_id: 5
  },
  {
    id: 2,
    name: "Brian Yu",
    title: "Senior Lecturer on Computer Science",
    bio: "Brian Yu es un instructor senior en Harvard University, donde enseña cursos de desarrollo web y móvil. Antes de unirse a Harvard, trabajó como ingeniero de software en Facebook. Es graduado de Harvard College y ha dedicado su carrera a hacer que la educación en informática sea más accesible para todos.",
    image_url: "../../brian.png",
    institution: "Harvard University",
    credentials: "A.B. in Computer Science, Harvard College",
    mentor_id: null
  }
];

const CourseInstructors = ({ data }) => {
  // En este ejemplo, usamos datos mock, pero en producción se usaría data.instructors
  const instructors = mockInstructors;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructores del curso</h2>
      
      {instructors && instructors.length > 0 ? (
        <div className="space-y-8">
          {instructors.map(instructor => (
            <div key={instructor.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <div className="md:flex">
                {/* Imagen del instructor */}
                <div className="md:w-1/3 lg:w-1/4">
                  <div className="h-60 md:h-full bg-gray-100 overflow-hidden">
                    <img 
                      src={instructor.image_url || 'https://via.placeholder.com/400x600?text=Instructor'} 
                      alt={instructor.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                </div>
                
                {/* Información del instructor */}
                <div className="p-6 md:w-2/3 lg:w-3/4">
                  <div className="flex flex-col h-full">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">{instructor.name}</h3>
                      <p className="text-[#8B0D37] font-medium mb-2">{instructor.title}</p>
                      <p className="text-gray-600 mb-1">{instructor.institution}</p>
                      <p className="text-gray-500 text-sm mb-4">{instructor.credentials}</p>
                      
                      <div className="prose prose-sm max-w-none text-gray-700 mb-6">
                        <p>{instructor.bio}</p>
                      </div>
                    </div>
                    
                    {/* Botón de mentoría si es aplicable */}
                    {instructor.mentor_id && (
                      <div className="mt-auto pt-4 border-t border-gray-200">
                        <button 
                          className="flex items-center text-[#8B0D37] hover:text-[#6E0B2A] transition-colors"
                          onClick={() => {
                            // Función para conectar con mentores
                            console.log('Conectar con mentor:', instructor.mentor_id);
                            // navigate(`/mentores/${instructor.mentor_id}`);
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                          </svg>
                          Solicitar mentoría con este instructor
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500">Información de instructores no disponible.</p>
        </div>
      )}
      
      <div className="bg-[#8B0D37]/10 rounded-lg p-6 mt-8">
        <div className="flex items-start">
          <div className="mr-4 flex-shrink-0">
            <svg className="h-6 w-6 text-[#8B0D37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-[#6E0B2A]">Acerca de nuestros instructores</h3>
            <div className="mt-2 text-sm text-[#8B0D37]">
              <p>Todos nuestros instructores son expertos en su campo con años de experiencia tanto en la industria como en la academia.</p>
              <p className="mt-1">Algunos instructores también están disponibles para sesiones de mentoría individuales.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseInstructors;