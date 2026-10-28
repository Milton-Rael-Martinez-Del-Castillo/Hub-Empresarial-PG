import React, { useState, useEffect } from "react";
import ReactPlayer from "react-player";
import { FaEnvelope, FaPhone, FaGlobe } from "react-icons/fa";

const Inspiring = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState(null);

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/inspiring");
        if (!response.ok) {
          throw new Error("Error al cargar las charlas");
        }
        const data = await response.json();
        setTalks(data);
      } catch (err) {
        console.error("Error fetching talks:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTalks();
  }, []);

  const openVideoModal = (videoUrl) => {
    setSelectedVideo(videoUrl);
    setShowModal(true);
  };

  const closeVideoModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  const openContactModal = (talk) => {
    setCurrentSpeaker({
      name: talk.speaker,
      email: talk.contacto_email,
      phone: talk.telefono, // Asumiendo que existe este campo en tu BD
      website: talk.website // Asumiendo que existe este campo en tu BD
    });
    setShowContactModal(true);
  };

  const closeContactModal = () => {
    setShowContactModal(false);
    setCurrentSpeaker(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66b5cb] mx-auto"></div>
          <p className="mt-4 text-lg text-[#880043]">Cargando charlas inspiradoras...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg max-w-md">
          <h3 className="text-xl font-bold text-red-800">Error al cargar las charlas</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#880043] text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Contenido Principal */}
      <main className="container mx-auto py-8 px-4 bg-white">
        <h2 className="text-4xl font-bold text-center text-[#66b5cb] mb-4">
          Inspiring Talks
        </h2>
        <p className="text-center text-lg text-[#8d8d8d] mb-12">
          Descubre charlas inspiradoras para motivarte y transformar tu visión como emprendedor.
        </p>

        {/* Grid de Tarjetas */}
        {talks.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {talks.map((talk) => (
              <div
                key={talk.id}
                className="bg-white shadow-lg rounded-lg overflow-hidden border hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                {talk.imagen_url && (
                  <img
                    src={talk.imagen_url}
                    alt={talk.titulo}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x225?text=Imagen+no+disponible";
                    }}
                  />
                )}
                <div className="p-4 flex-grow">
                  <h3 className="text-2xl font-bold text-[#880043]">
                    {talk.titulo}
                  </h3>
                  <p className="text-sm text-[#8d8d8d] mt-1">
                    por {talk.speaker}
                  </p>
                  <p className="text-base text-[#8d8d8d] mt-2">
                    {talk.descripcion}
                  </p>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <button
                    onClick={() => talk.video_url && openVideoModal(talk.video_url)}
                    disabled={!talk.video_url}
                    className={`bg-[#66b5cb] text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors duration-300 ${
                      !talk.video_url ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Ver charla
                  </button>
                  {talk.contacto_email && (
                    <button
                      onClick={() => openContactModal(talk)}
                      className="text-[#880043] hover:text-[#66b5cb] transition-colors duration-300"
                    >
                      <FaEnvelope className="text-xl" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-[#8d8d8d]">No hay charlas disponibles en este momento.</p>
          </div>
        )}
      </main>

      {/* Modal para el video */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl relative">
            <button
              onClick={closeVideoModal}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 text-3xl"
            >
              &times;
            </button>
            <div className="p-4">
              <div className="aspect-w-16 aspect-h-9">
                <ReactPlayer
                  url={selectedVideo}
                  width="100%"
                  height="100%"
                  controls={true}
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1 }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de contacto */}
      {showContactModal && currentSpeaker && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md relative p-6">
            <button
              onClick={closeContactModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              &times;
            </button>
            <h3 className="text-2xl font-bold text-[#880043] mb-4">
              Contactar a {currentSpeaker.name}
            </h3>
            
            <div className="space-y-4">
              {currentSpeaker.email && (
                <div className="flex items-center">
                  <FaEnvelope className="text-[#66b5cb] mr-3 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <a 
                      href={`mailto:${currentSpeaker.email}`}
                      className="text-[#880043] hover:underline"
                    >
                      {currentSpeaker.email}
                    </a>
                  </div>
                </div>
              )}

              {currentSpeaker.phone && (
                <div className="flex items-center">
                  <FaPhone className="text-[#66b5cb] mr-3 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <a 
                      href={`tel:${currentSpeaker.phone}`}
                      className="text-[#880043] hover:underline"
                    >
                      {currentSpeaker.phone}
                    </a>
                  </div>
                </div>
              )}

              {currentSpeaker.website && (
                <div className="flex items-center">
                  <FaGlobe className="text-[#66b5cb] mr-3 text-xl" />
                  <div>
                    <p className="text-sm text-gray-500">Sitio web</p>
                    <a 
                      href={currentSpeaker.website.startsWith('http') ? currentSpeaker.website : `https://${currentSpeaker.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#880043] hover:underline"
                    >
                      {currentSpeaker.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={closeContactModal}
                className="bg-[#880043] text-white py-2 px-6 rounded hover:bg-opacity-90 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inspiring;