// src/components/DevelopersSection.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const DevelopersSection = () => {
  const developers = [
    {
      name: "Manuel Augusto Ovando Crespo",
      career: "Ingeniería en Sistemas Informáticos",
      photo: "../developer1.jpg",
      email: "ocm1010217@est.univalle.edu",
      bio: "Estudiante activo de la carrera de Ingeniería en Sistemas en UNIVALLE, desarrollando competencias en tecnologías innovadoras"
    },
    {
      name: "Greisa Karen Aguila Lujan",
      career: "Ingeniería en Sistemas Informáticos",
      photo: "../developer2.jpg",
      email: "alg0029702@est.univalle.edu",
      bio: "Cursando la formación en Ingeniería de Sistemas en la Universidad Privada del Valle, con enfoque en soluciones tecnológicas"
    },
    {
      name: "Milton Rael Martinez Del Castillo",
      career: "Ingeniería en Sistemas Informáticos",
      photo: "../developer3.jpg",
      email: "mdm0033384@est.univalle.edu",
      bio: "Miembro del programa de Ingeniería en Sistemas de UNIVALLE, adquiriendo conocimientos en desarrollo de software"
    },
    {
      name: "Sergio Alejandro Davalos Aramayo",
      career: "Ingeniería en Sistemas Informáticos",
      photo: null,
      email: "das0030045@est.univalle.edu",
      bio: "Estudiante dedicado de la carrera de Sistemas Informáticos, preparándose en el ámbito tecnológico universitario",
      initial: "S"
    },
    {
      name: "Jose Luis Larrazabal Flores",
      career: "Ingeniería en Sistemas Informáticos",
      photo: "../developer5.jpg",
      email: "lfj1009416@est.univalle.edu",
      bio: "Formándose como ingeniero en sistemas en la Universidad Privada del Valle, con visión innovadora"
    }
  ];

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#f8f9fa] to-[#e9ecef]">
      <div className="max-w-7xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#880043] mb-4">
            Nuestro Equipo de Desarrollo
          </h2>
          <p className="text-xl text-[#8d8d8d] max-w-3xl mx-auto">
            Estudiantes de Ingeniería en Sistemas Informáticos de la Universidad Privada del Valle.
            Comprometidos con la excelencia académica y el desarrollo tecnológico.
          </p>
        </div>

        {/* Grid de desarrolladores */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {developers.map((dev, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-2"
            >
              {/* Foto o Inicial */}
              <div className="h-48 bg-gradient-to-br from-[#880043] to-[#66b6cb] flex items-center justify-center">
                {dev.photo ? (
                  <img 
                    src={dev.photo} 
                    alt={dev.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "/default-avatar.jpg";
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <span className="text-8xl font-bold text-white opacity-80">
                      {dev.initial}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#880043] mb-1">{dev.name}</h3>
                <p className="text-[#66b6cb] font-medium mb-3">{dev.career}</p>
                <p className="text-[#8d8d8d] text-sm mb-4">{dev.bio}</p>
                
                {/* Contacto por correo con icono */}
                <div className="flex items-center justify-center space-x-2">
                  <FontAwesomeIcon 
                    icon={faEnvelope} 
                    className="text-[#880043] hover:text-[#66b6cb] transition-colors duration-200"
                  />
                  <a 
                    href={`mailto:${dev.email}`}
                    className="text-sm text-[#880043] hover:text-[#66b6cb] font-medium transition-colors duration-200"
                  >
                    {dev.email}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DevelopersSection;