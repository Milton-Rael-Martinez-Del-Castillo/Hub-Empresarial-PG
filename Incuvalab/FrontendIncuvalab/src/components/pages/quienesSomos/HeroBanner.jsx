// src/components/HeroBanner.jsx
import React from 'react';

const HeroBanner = ({ imageSrc, title }) => {
  return (
    <div className="relative w-full h-[640px] overflow-hidden">
      {/* Imagen de fondo */}
      <img 
        src={imageSrc} 
        alt="INCUVALAB" 
        className="absolute w-full h-full object-cover"
      />
      
      {/* Overlay semi-transparente para mejorar legibilidad del texto */}
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      
      {/* Contenido centrado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold text-center px-4">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default HeroBanner;