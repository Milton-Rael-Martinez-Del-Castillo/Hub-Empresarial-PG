import React from 'react';

// Datos mock para el syllabus (normalmente vendría del backend)
const mockSyllabus = [
  {
    week: 1,
    title: "Scratch",
    description: "Introducción al pensamiento computacional con el lenguaje visual Scratch.",
    items: [
      "Pensamiento computacional",
      "Algoritmos",
      "Funciones y variables",
      "Condicionales"
    ]
  },
  {
    week: 2,
    title: "C",
    description: "Introducción a programación en bajo nivel con el lenguaje C.",
    items: [
      "Compilación",
      "Variables y tipos de datos",
      "Operadores",
      "Condicionales y bucles"
    ]
  },
  {
    week: 3,
    title: "Arrays",
    description: "Estructuras de datos, matrices y manipulación de memoria.",
    items: [
      "Matrices unidimensionales",
      "Matrices multidimensionales",
      "Manipulación de memoria",
      "Eficiencia de algoritmos"
    ]
  },
  {
    week: 4,
    title: "Algoritmos",
    description: "Algoritmos fundamentales y complejidad computacional.",
    items: [
      "Búsqueda binaria",
      "Algoritmos de ordenamiento",
      "Análisis de complejidad",
      "Notación Big O"
    ]
  },
  {
    week: 5,
    title: "Estructuras de datos",
    description: "Implementación y uso de estructuras de datos avanzadas.",
    items: [
      "Listas enlazadas",
      "Pilas y colas",
      "Árboles",
      "Tablas hash"
    ]
  }
];

const CourseSyllabus = ({ data }) => {
  // En este ejemplo, usamos datos mock, pero en producción se usaría data.syllabus
  const syllabus = mockSyllabus;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Programa del curso</h2>
      
      {syllabus && syllabus.length > 0 ? (
        <div className="space-y-6">
          {syllabus.map((module, index) => (
            <div 
              key={index} 
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center border-b border-gray-200 bg-gray-50 p-4">
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-[#8B0D37]/10 text-[#8B0D37] rounded-full mr-4">
                  <span className="font-bold">{module.week}</span>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                </div>
              </div>
              <div className="p-4">
                <p className="text-gray-700 mb-4">{module.description}</p>
                {module.items && module.items.length > 0 && (
                  <ul className="space-y-2">
                    {module.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <svg className="h-5 w-5 text-[#8B0D37] mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                        </svg>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-gray-200 rounded-lg bg-gray-50">
          <p className="text-gray-500">El programa detallado de este curso aún no está disponible.</p>
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
            <h3 className="text-lg font-medium text-[#6E0B2A]">Información sobre el programa</h3>
            <div className="mt-2 text-sm text-[#8B0D37]">
              <p>Este programa está sujeto a cambios según el ritmo de aprendizaje del grupo.</p>
              <p className="mt-1">El contenido se actualiza regularmente para mantenerse al día con las últimas tecnologías y mejores prácticas.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseSyllabus;