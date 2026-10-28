import React, { useRef, useState, useEffect } from 'react';
import mentoriaPareja from '/fondo-mentoring.jpg';

const MentoringPage = () => {
  const carouselRef = useRef(null);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const apiUrl = window.location.hostname === 'localhost'
          ? 'http://localhost:8000/api/mentor'
          : '/api/mentor';

        const response = await fetch(apiUrl, {
          headers: {
            'Accept': 'application/json'
          }
        });

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Respuesta inesperada: ${text.substring(0, 100)}...`);
        }

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        setMentors(data);
      } catch (err) {
        setError(`Error al cargar mentores: ${err.message}`);
        console.error('Error fetching mentors:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMentors();
  }, []);

  const scroll = (direction) => {
    const scrollAmount = 320;
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#880043]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-md">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="mt-2 text-sm">Por favor verifica:
            <ul className="list-disc pl-5 text-left">
              <li>Que el servidor backend esté corriendo</li>
              <li>Que la ruta <code>/api/mentor</code> exista</li>
              <li>Que no haya problemas de CORS</li>
            </ul>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-center font-montserrat">
      {/* Imagen de fondo con título */}
      <div className="relative h-96 overflow-hidden">
        <img
          src="/fondo-mentoring1.jpg"
          alt="Mentoría"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h2 className="text-white text-3xl md:text-5xl font-bold px-4 text-center">
            Descubre los mejores mentores del mundo
          </h2>
        </div>
      </div>

      {/* Sección de introducción con imagen */}
      <div className="flex flex-col md:flex-row items-center justify-center my-16 px-6 gap-8 max-w-6xl mx-auto">
        <div className="w-full md:w-1/2 h-96">
          <img
            src={mentoriaPareja}
            alt="Sesión de mentoría"
            className="rounded-lg shadow-lg w-full h-full object-cover object-center"
          />
        </div>
        <div className="w-full md:w-1/2 text-left">
          <h3 className="text-2xl font-semibold mb-4 text-[#880043]">
            Tu próximo capítulo, posible gracias a la mentoría
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed">
            Conecta con expertos apasionados que te guiarán en tu camino profesional.
            Desde decisiones importantes hasta consejos prácticos, un buen mentor puede
            marcar la diferencia en tu crecimiento.
          </p>
        </div>
      </div>

      {/* Texto central */}
      <div className="my-12 px-6">
        <h3 className="text-xl font-semibold mb-2">Encuentra Tu Mentor Ideal:</h3>
        <p className="text-lg mb-6">¡Desliza y Descubre!</p>

        {/* Carrusel con flechas */}
        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-[#880043] text-white rounded-full p-2 z-10 hover:bg-opacity-80 shadow-md"
            aria-label="Desplazar izquierda"
          >
            &lt;
          </button>

          <div
            ref={carouselRef}
            className="flex space-x-6 overflow-x-auto px-2 scroll-smooth py-4"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {mentors.length > 0 ? (
              mentors.map((mentor, index) => (
                <div
                  key={index}
                  className="min-w-[300px] bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex-shrink-0 hover:shadow-xl transition-shadow flex flex-col"
                >
                  <div className="w-full h-64 rounded-md mb-4 overflow-hidden flex-shrink-0">
                    {mentor.image_url ? (
                      <img
                        src={mentor.image_url}
                        alt={`Foto de ${mentor.nombre}`}
                        className="w-full h-full object-cover object-top"
                        style={{ minHeight: '256px' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://ui-avatars.com/api/?name=${mentor.nombre}&background=880043&color=fff&size=200`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#880043] to-[#66B5CB] flex items-center justify-center text-white text-5xl font-bold">
                        {mentor.nombre.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-grow flex flex-col">
                    <h4 className="font-bold text-lg text-gray-800">{mentor.nombre}</h4>
                    <p className="text-sm text-gray-600 mt-1">{mentor.area_experiencia}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      <span className="font-medium">Teléfono:</span> {mentor.telefono || 'No disponible'}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">Disponibilidad:</span> {mentor.disponibilidad || 'Flexible'}
                    </p>
                    <div className="mt-4 flex gap-2 justify-center">
                      <button 
                        className="bg-[#880043] text-white px-4 py-2 rounded-lg hover:bg-[#660032] transition-colors w-full flex items-center justify-center gap-2"
                        onClick={() => window.location.href = `tel:${mentor.telefono}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Contactar
                      </button>
                      <button className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg hover:bg-[#52c2c6] transition-colors w-full">
                        No contactar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="min-w-full text-center py-8">
                <p className="text-gray-500 italic">No se encontraron mentores disponibles</p>
              </div>
            )}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-[#880043] text-white rounded-full p-2 z-10 hover:bg-opacity-80 shadow-md"
            aria-label="Desplazar derecha"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentoringPage;