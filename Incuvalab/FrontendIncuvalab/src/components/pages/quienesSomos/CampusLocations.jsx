// src/components/CampusLocations.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const CampusLocations = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  // Datos de campus organizados por contenedores (izquierda, centro, derecha)
  const campusData = {
    // Columna izquierda (2 imágenes verticales)
    left: [
      {
        id: 1,
        name: "Laboratorio de Innovación",
        location: "LA PAZ, BOLIVIA",
        image: "/images/acercaIncuvalab/campus-1.png",
        description: "Nuestro laboratorio principal donde ideas innovadoras se transforman en realidad, equipado con tecnología de punta para el desarrollo de prototipos.",
        link: "/sedes/laboratorio"
      },
      {
        id: 2,
        name: "Centro AgriTech",
        location: "COCHABAMBA, BOLIVIA",
        image: "/images/acercaIncuvalab/campus-2.png",
        description: "Dedicado a soluciones tecnológicas para el sector agrícola, con espacios de experimentación y pruebas de campo.",
        link: "/sedes/agritech"
      }
    ],
    // Columna central (1 imagen grande)
    center: {
      id: 3,
      name: "Campus Principal",
      location: "LA PAZ, BOLIVIA",
      image: "/images/acercaIncuvalab/campus-3.png",
      description: "Ubicado en el corazón de La Paz, el Campus Principal ofrece la experiencia completa de INCUVALAB con todas sus instalaciones, espacios de trabajo colaborativo, laboratorios y áreas de investigación.",
      link: "/sedes/principal"
    },
    // Columna derecha (2 imágenes verticales)
    right: [
      {
        id: 4,
        name: "Centro Tecnológico",
        location: "SANTA CRUZ, BOLIVIA",
        image: "/images/acercaIncuvalab/campus-4.png",
        description: "Un espacio moderno dedicado al desarrollo de emprendimientos tecnológicos con equipamiento especializado y mentores técnicos.",
        link: "/sedes/tecnologico"
      },
      {
        id: 5,
        name: "Hub Internacional",
        location: "NUEVA YORK, EE.UU.",
        image: "/images/acercaIncuvalab/campus-5.png",
        description: "Nuestra conexión internacional que facilita vínculos con ecosistemas globales de emprendimiento e inversores internacionales.",
        link: "/sedes/internacional"
      }
    ]
  };

  return (
    <div className="w-full bg-white-100 py-12">
      <div className="max-w-[1200px] mx-auto">
        {/* Título de la sección */}
        <div className="px-4 mb-8">
          <h2 className="text-[#8B0D37] font-bold text-xl uppercase tracking-wider">
            SEDES DE INCUVALAB & UBICACIONES
          </h2>
        </div>

        {/* Contenedor principal con 3 columnas */}
        <div className="flex flex-col md:flex-row">
          {/* Columna izquierda - 2 imágenes apiladas verticalmente */}
          <div className="flex flex-col w-full md:w-1/4">
            {campusData.left.map((campus, index) => (
              <div 
                key={campus.id}
                className="h-[300px] relative overflow-hidden group"
                onMouseEnter={() => setActiveIndex(`left-${index}`)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <img 
                  src={campus.image} 
                  alt={campus.name} 
                  className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay más oscuro en hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-80 transition-opacity duration-300"></div>
                
                {/* Título y ubicación - visibles solo cuando NO hay hover */}
                <div className={`absolute bottom-0 left-0 p-4 z-10 transition-opacity duration-300 ${activeIndex === `left-${index}` ? 'opacity-0' : 'opacity-100'}`}>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-1">{campus.name}</h3>
                  <p className="text-white text-xs md:text-sm tracking-wider">{campus.location}</p>
                </div>

                {/* Información en hover */}
                <div className={`absolute inset-0 flex flex-col justify-center p-4 transition-opacity duration-300 ${activeIndex === `left-${index}` ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-2">{campus.name}</h3>
                  <p className="text-white text-xs md:text-sm tracking-wider mb-2">{campus.location}</p>
                  <div className="h-px w-12 bg-white mb-3"></div>
                  <p className="text-white mb-4 text-xs md:text-sm leading-relaxed">{campus.description}</p>
                  <Link 
                    to={campus.link} 
                    className="text-blue-300 hover:text-white flex items-center self-start transition-colors duration-200 text-sm"
                  >
                    <span>Explorar {campus.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Columna central - 1 imagen grande */}
          <div className="w-full md:w-2/4">
            <div 
              className="h-[600px] relative overflow-hidden group"
              onMouseEnter={() => setActiveIndex('center')}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <img 
                src={campusData.center.image} 
                alt={campusData.center.name} 
                className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay más oscuro en hover */}
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-80 transition-opacity duration-300"></div>
              
              {/* Título y ubicación - visibles solo cuando NO hay hover */}
              <div className={`absolute bottom-0 left-0 p-6 z-10 transition-opacity duration-300 ${activeIndex === 'center' ? 'opacity-0' : 'opacity-100'}`}>
                <h3 className="text-white text-3xl font-bold mb-1">{campusData.center.name}</h3>
                <p className="text-white text-sm tracking-wider">{campusData.center.location}</p>
              </div>

              {/* Información en hover */}
              <div className={`absolute inset-0 flex flex-col justify-center p-8 transition-opacity duration-300 ${activeIndex === 'center' ? 'opacity-100' : 'opacity-0'}`}>
                <h3 className="text-white text-3xl font-bold mb-2">{campusData.center.name}</h3>
                <p className="text-white text-sm tracking-wider mb-3">{campusData.center.location}</p>
                <div className="h-px w-16 bg-white mb-6"></div>
                <p className="text-white mb-8 text-lg leading-relaxed">{campusData.center.description}</p>
                <Link 
                  to={campusData.center.link} 
                  className="text-blue-300 hover:text-white flex items-center self-start transition-colors duration-200 text-lg"
                >
                  <span>Explorar {campusData.center.name}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>

          {/* Columna derecha - 2 imágenes apiladas verticalmente */}
          <div className="flex flex-col w-full md:w-1/4">
            {campusData.right.map((campus, index) => (
              <div 
                key={campus.id}
                className="h-[300px] relative overflow-hidden group"
                onMouseEnter={() => setActiveIndex(`right-${index}`)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                <img 
                  src={campus.image} 
                  alt={campus.name} 
                  className="absolute w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Overlay más oscuro en hover */}
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-80 transition-opacity duration-300"></div>
                
                {/* Título y ubicación - visibles solo cuando NO hay hover */}
                <div className={`absolute bottom-0 left-0 p-4 z-10 transition-opacity duration-300 ${activeIndex === `right-${index}` ? 'opacity-0' : 'opacity-100'}`}>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-1">{campus.name}</h3>
                  <p className="text-white text-xs md:text-sm tracking-wider">{campus.location}</p>
                </div>

                {/* Información en hover */}
                <div className={`absolute inset-0 flex flex-col justify-center p-4 transition-opacity duration-300 ${activeIndex === `right-${index}` ? 'opacity-100' : 'opacity-0'}`}>
                  <h3 className="text-white text-xl md:text-2xl font-bold mb-2">{campus.name}</h3>
                  <p className="text-white text-xs md:text-sm tracking-wider mb-2">{campus.location}</p>
                  <div className="h-px w-12 bg-white mb-3"></div>
                  <p className="text-white mb-4 text-xs md:text-sm leading-relaxed">{campus.description}</p>
                  <Link 
                    to={campus.link} 
                    className="text-blue-300 hover:text-white flex items-center self-start transition-colors duration-200 text-sm"
                  >
                    <span>Explorar {campus.name}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusLocations;