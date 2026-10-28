// Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-[#8B0D37] w-full py-4">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-12">
        {/* Left side - Title */}
        <div className="text-white text-2xl tracking-wide">
          CENTRO DE EMPRENDIMIENTO UNIVALLE
        </div>
        
        {/* Right side - Search */}
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar"
              className="bg-[#6B0A2A] text-white placeholder-gray-300 px-6 py-2.5 rounded-full w-[280px] text-base focus:outline-none focus:ring-1 focus:ring-white/30"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;