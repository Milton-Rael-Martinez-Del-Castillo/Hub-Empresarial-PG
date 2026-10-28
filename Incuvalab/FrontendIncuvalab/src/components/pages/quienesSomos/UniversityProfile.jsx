import React from 'react';

const UniversityProfile = () => {
  // Datos estadísticos para el panel derecho
  const stats = [
    {
      number: "+15000",
      description: "Estudiantes nacionales y extranjeros"
    },
    {
      number: "+19000",
      description: "Profesionales a nivel pregrado y postgrado"
    },
    {
      number: "35",
      description: "Años de trayectoria académica"
    },
    {
      number: "5 Sedes",
      description: "Cochabamba, La Paz, Sucre, Trinidad y Santa Cruz"
    }
  ];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <div className="flex flex-col md:flex-row">
          {/* Columna izquierda - texto e imagen */}
          <div className="w-full md:w-3/5 pr-0 md:pr-12 mb-10 md:mb-0">
            <h2 className="text-[#8B0D37] text-3xl font-bold mb-6">Nuestro Perfil</h2>
            
            <p className="text-gray-700 mb-8 leading-relaxed">
              La idea de "Univalle para toda la vida" responde a la necesidad de transformar la 
              educación universitaria en una constante, acompañando al futuro laboral incluso 
              antes de integrarse a nuestro centro de estudios superiores, mediante programas de 
              guía vocacional y respaldo académico. Después de su graduación, a través de 
              diversas ventajas y la beca generación para los descendientes 
              de nuestros graduados, nuestra institución académica se transforma 
              en un patrimonio que se transmite de una generación a otra.
            </p>
            
            {/* Imagen circular perfectamente centrada */}
            <div className="flex justify-center">
              <div className="w-56 h-56 rounded-full overflow-hidden border-4 border-white shadow-lg mx-auto">
                <img 
                  src="/founder.png" 
                  alt="Fundador de Univalle" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
          
          {/* Columna derecha con relieve - datos y estadísticas (fondo blanco) */}
          <div className="w-full md:w-2/5 border-l-0 md:border-l border-gray-200 pl-0 md:pl-12 relative font-light
                          bg-white md:shadow-md md:rounded-lg md:p-8 md:border md:border-gray-100 md:transform md:-translate-y-4">
            {/* Logo en la parte superior con relieve - centrado */}
            <div className="flex justify-center w-full mb-8">
              <div className="bg-white p-2 rounded-full shadow-lg transform -translate-y-10">
                <img 
                  src="logo-univalle.png" 
                  alt="Logo Univalle" 
                  className="w-20 h-20"
                />
              </div>
            </div>
            
            {/* Información institucional - centrada con fuentes elegantes */}
            <div className="mb-12 space-y-8 text-center">
              <div className="p-3 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 rounded-md">
                <h3 className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-serif">Locación</h3>
                <p className="text-gray-800 font-serif text-xl italic">Cochabamba</p>
              </div>
              
              <div className="p-3 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 rounded-md">
                <h3 className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-serif">Fundado</h3>
                <p className="text-gray-800 font-serif text-xl">1865</p>
              </div>
              
              <div className="p-3 hover:bg-gray-50 hover:shadow-sm transition-all duration-300 rounded-md">
                <h3 className="text-gray-500 text-sm mb-1 uppercase tracking-wider font-serif">Identidad</h3>
                <p className="text-gray-800 font-serif text-xl">
                  <span className="font-medium">Universidad Privada</span>, 
                  <span className="italic font-light"> misión publica</span>
                </p>
              </div>
            </div>
            
            {/* Estadísticas sin efectos de hover ni relieve */}
            <div className="grid grid-cols-2 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center p-4">
                  <h3 className="text-[#8B0D37] text-3xl md:text-4xl font-serif font-bold mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-600 text-sm font-light tracking-wide">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversityProfile;