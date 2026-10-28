import React, { useState, useEffect, useCallback } from 'react';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitionDirection, setTransitionDirection] = useState('right');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  
  const slides = [
    {
      title: "Eventos:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/img1.jpeg",
    },
    {
      title: "Noticias:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/img2.jpeg",
    },
    {
      title: "Mentores:",
      description: "Se viene un próximo evento futuro emprendedor estate atento",
      image: "/img3.jpeg",
    },
  ];

  // Función para avanzar al siguiente slide
  const goToNextSlide = useCallback(() => {
    setTransitionDirection('right');
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  // Función para retroceder al slide anterior
  const goToPrevSlide = useCallback(() => {
    setTransitionDirection('left');
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  }, [slides.length]);

  // Efecto para el autoplay
  useEffect(() => {
    let intervalId;
    
    if (isAutoPlaying) {
      intervalId = setInterval(() => {
        goToNextSlide();
      }, 5000); // Cambia cada 5 segundos
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isAutoPlaying, goToNextSlide]);

  // Pausar autoplay cuando el usuario interactúa
  const handleUserInteraction = (action) => {
    setIsAutoPlaying(false);
    action();
    // Reanudar autoplay después de 10 segundos de inactividad
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  return (
    <div className="w-full group">
      <div className="relative w-full h-[500px] overflow-hidden">
        {/* Contenedor de slides con animación */}
        <div className="relative w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
                index === currentSlide
                  ? 'translate-x-0'
                  : index < currentSlide
                    ? '-translate-x-full'
                    : 'translate-x-full'
              }`}
            >
              {/* Imagen de fondo */}
              <div 
                className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                {/* Overlay para mejor legibilidad */}
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              </div>

              {/* Contenido del slide */}
              {index === currentSlide && (
                <div className="relative z-10 w-full h-full flex flex-col justify-end px-8 md:px-16 max-w-[1400px] mx-auto">
                  <div className="pb-12">
                    <h2 className="text-white text-3xl font-bold mb-2">
                      {slide.title}
                    </h2>
                    <p className="text-white text-xl mb-8">
                      {slide.description}
                    </p>

                    {/* Indicadores */}
                    <div className="flex gap-4 mb-4">
                      {slides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            handleUserInteraction(() => {
                              setTransitionDirection(idx > currentSlide ? 'right' : 'left');
                              setCurrentSlide(idx);
                            });
                          }}
                          className={`w-4 h-4 rounded-full ${
                            currentSlide === idx 
                              ? 'bg-[#8B0D37] ring-2 ring-white' 
                              : 'bg-[#8B0D37] bg-opacity-60'
                          } transition-all`}
                          aria-label={`Ir al slide ${idx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Botones de navegación */}
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-20 opacity-0 group-hover:opacity-100"
          onClick={() => handleUserInteraction(goToPrevSlide)}
          aria-label="Slide anterior"
        >
          &#10094;
        </button>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition-all z-20 opacity-0 group-hover:opacity-100"
          onClick={() => handleUserInteraction(goToNextSlide)}
          aria-label="Siguiente slide"
        >
          &#10095;
        </button>

      </div>
    </div>
  );
};

export default Carousel;