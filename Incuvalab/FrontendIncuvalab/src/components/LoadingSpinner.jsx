// src/components/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = "Cargando...", size = "default", className = "" }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    default: "w-12 h-12",
    large: "w-16 h-16"
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full fade-in ${className}`}>
      <div 
        className={`animate-spin rounded-full border-t-4 border-blue-500 border-opacity-50 border-solid ${sizeClasses[size]}`}
        role="status" // Mejora de accesibilidad
        aria-label="Cargando" // Mejora de accesibilidad
      ></div>
      {message && (
        <p className="mt-4 text-gray-600 slide-in" aria-live="polite">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;