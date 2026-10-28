// src/components/MissionStatement.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const MissionStatement = () => {
  // Datos para los enlaces temáticos
  const thematicLinks = [
    { title: "Compromiso Público", path: "/compromiso-publico" },
    { title: "Diversidad", path: "/diversidad" },
    { title: "Sostenibilidad", path: "/sostenibilidad" },
    { title: "Liderazgo", path: "/liderazgo" }
  ];

  return (
    <div className="py-16 px-6 bg-white">
      <div className="max-w-[1000px] mx-auto text-center">
        {/* Título superior en color principal */}
        <h2 className="text-[#8B0D37] text-lg font-semibold mb-8 tracking-wide uppercase">
          CONOCIMIENTO PARA UN BIEN MAYOR
        </h2>
        
        {/* Texto principal */}
        <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed mb-16 font-serif">
          Hemos adoptado el espíritu revolucionario que fundó nuestra universidad y
          nos animamos mutuamente a seguir líneas de pensamiento impredecibles para generar
          cambios a escala local e internacional.
        </p>
        
        {/* Enlaces temáticos */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {thematicLinks.map((link, index) => (
            <Link 
              key={index} 
              to={link.path}
              className="text-blue-600 hover:text-blue-800 flex items-center transition-colors duration-200 text-lg"
            >
              {link.title}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-1" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MissionStatement;