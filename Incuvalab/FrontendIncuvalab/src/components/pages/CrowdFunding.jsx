import React from 'react';
import { useNavigate } from 'react-router-dom';

const EnDesarrollo = () => {
  const navigate = useNavigate();

  const volverInicio = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white border-4 border-[#880043] rounded-lg p-8 max-w-md w-full text-center shadow-lg">
        {/* Icono de construcción */}
        <div className="mb-4">
          <i className="fas fa-tools text-[#880043] text-5xl"></i> {/* Ícono de herramientas de construcción */}
        </div>
        <h1 className="text-[#880043] text-3xl font-semibold mb-4">¡Sección en Desarrollo!</h1>
        <p className="text-[#8d8d8d] text-lg mb-6">
          Estamos trabajando para traerte una experiencia increíble de Crowd Funding.
        </p>
        <button
          onClick={volverInicio}
          className="bg-[#66b5cb] text-white py-3 px-6 rounded-lg text-lg hover:bg-[#5fa8b4] transition-colors"
        >
          Volver al inicio
        </button>
      </div>
    </div>
  );
};

export default EnDesarrollo;
