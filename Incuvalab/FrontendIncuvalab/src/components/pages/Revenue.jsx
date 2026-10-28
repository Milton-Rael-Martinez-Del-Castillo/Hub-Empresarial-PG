import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '/revenue.jpg';

const Revenue = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/empresas_servicios");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Convertir el texto de servicios a un array
        const parsedData = data.map((section) => ({
          ...section,
          servicios: section.servicios 
            ? section.servicios.split('\n').filter(item => item.trim())
            : []
        }));

        setSections(parsedData);
        setError(null);
      } catch (err) {
        console.error("❌ Error cargando datos de la API:", err);
        setError("Error al cargar los datos. Por favor intenta más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0D37]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-[#8B0D37] text-white px-4 py-2 rounded"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Header con imagen de fondo */}
      <div
        className="relative h-[32vh] md:h-[36vh] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundPosition: 'center 30%',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60 z-0"></div>
        <div className="relative text-white text-center px-5 font-montserrat z-10 flex flex-col justify-center items-center mb-12">
          <h2 className="text-3xl mb-2">¿Estás listo para empezar?</h2>
          <p className="text-xl font-bold">TRABAJA CON NOSOTROS</p>
        </div>
      </div>

      {/* Subtítulo y descripción */}
      <div className="text-center text-lg font-semibold font-montserrat mt-8 text-gray-800">
        🚀 Plataforma de Transferencia Tecnológica
      </div>

      <div className="text-center text-base font-montserrat text-gray-700 mt-3 leading-relaxed max-w-[800px] mx-auto mb-8">
        ¿Tenés una idea, producto o desafío técnico y no sabés por dónde empezar?<br />
        Esta plataforma está pensada para ayudarte.
      </div>

      <div className="text-center text-base font-montserrat text-gray-700 leading-relaxed max-w-[800px] mx-auto mb-8">
        Actuamos como un puente entre empresas, emprendedores y centros de conocimiento,<br />
        permitiendo el levantamiento de solicitudes tecnológicas para impulsar nuevos desarrollos,<br />
        mejorar procesos o buscar soluciones a medida.
      </div>

      <div className="border-t-[3px] border-black w-4/5 mx-auto my-8"></div>

      {/* Secciones dinámicas desde API */}
      {sections.length > 0 ? (
        sections.map((section, index) => (
          <div key={index}>
            <div className="flex flex-col md:flex-row items-center gap-6 w-4/5 mx-auto mt-10">
              <img
                src={section.imagen_url || 'https://via.placeholder.com/400x250'}
                alt={section.titulo}
                className="w-[400px] h-[250px] object-cover rounded-lg border-[5px] border-gray-900"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x250';
                }}
              />
              <div className="text-lg font-semibold font-montserrat text-gray-800">
                <h2 className="text-2xl mb-2">{section.titulo}</h2>
                <p className="text-base font-normal">{section.descripcion}</p>
              </div>
            </div>

            <div className="text-center text-base font-semibold font-montserrat text-gray-800 mt-8">
              {section.subtitulo}
            </div>

            <ul className="list-disc font-montserrat text-gray-700 text-base mt-4 pl-10 max-w-4xl mx-auto">
              {section.servicios.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>

            <div className="flex justify-center mt-6">
              <button
                onClick={() => navigate('/crud-revenue')}
                className="bg-[#66B5CB] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#579fb3] transition-all"
              >
                Contacta con nosotros
              </button>
            </div>

            <div className="border-t-[3px] border-black w-4/5 mx-auto my-8"></div>
          </div>
        ))
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No hay servicios disponibles actualmente.</p>
        </div>
      )}
    </>
  );
};

export default Revenue;