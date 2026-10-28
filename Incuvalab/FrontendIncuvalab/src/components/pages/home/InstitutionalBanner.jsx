// src/components/InstitutionalBanner.jsx
import React from "react";

function InstitutionalBanner() {
  return (
    <div className="relative w-full h-[472px] bg-[#880043] py-16 flex justify-center items-center">
      <div className="w-full max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-center">
        {/* Logos con fondos circulares blancos */}
        <div className="flex items-center space-x-6 mb-8 md:mb-0">
          {/* Logo INCUVA LAB */}
          <div className="bg-white rounded-full p-2 w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
            <img 
              src="/logo-incuvalab.png" 
              alt="INCUVA LAB" 
              className="w-24 h-24 md:w-28 md:h-28 object-contain"
            />
          </div>
          
          {/* Logo Universidad del Valle */}
          <div className="bg-white rounded-full p-2 w-28 h-28 md:w-32 md:h-32 flex items-center justify-center">
            <img 
              src="/logo-univalle.png" 
              alt="Universidad del Valle Bolivia" 
              className="w-24 h-24 md:w-28 md:h-28 object-contain"
            />
          </div>
        </div>
        
        {/* Línea vertical divisoria - visible solo en desktop */}
        <div className="hidden md:block w-px h-24 bg-white mx-12"></div>
        
        {/* Texto y botón */}
        <div className="text-center md:text-left md:flex-1 md:max-w-md">
          <h2 className="text-white text-2xl md:text-3xl font-medium mb-6">
            En Univalle estamos unidos por un propósito compartido
          </h2>
          
          <a
            href="https://www.univalle.edu/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block border-2 border-white text-white px-10 py-3 hover:bg-white hover:text-[#880043] transition-colors duration-300"
          >
            EXPLORAR
          </a>

        </div>
      </div>
    </div>
  );
}

export default InstitutionalBanner;