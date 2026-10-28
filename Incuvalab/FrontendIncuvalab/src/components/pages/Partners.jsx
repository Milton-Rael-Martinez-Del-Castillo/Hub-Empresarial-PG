import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../login/AuthContext';
import partnerImage from '/oratoria.jpg';
import expert1 from '/experto1.jpg';
import expert2 from '/experto2.jpg';
import expert3 from '/experto3.jpg';
import expert4 from '/experto4.jpg';
import expert5 from '/experto5.png';
import profile1 from '/tinder.jpg'; 
import icon1 from '/icon1.png';
import icon2 from '/icon2.png';
import icon3 from '/icon3.png';
import '../../styles/Partners.css';

const PartnerSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login, logout } = useAuth();
  const [showAll, setShowAll] = useState(false);
  const [hiddenCards, setHiddenCards] = useState([]);
  const [visibleExperts, setVisibleExperts] = useState(5);
  const [interesCount, setInteresCount] = useState(0);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [expertsData, setExpertsData] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    // Verificar autenticación al cargar el componente
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:8000/api/verify-auth', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAuthenticated(response.data.isAuthenticated);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setIsAuthenticated(false);
    }
  };

    const handleStorageChange = () => {
      checkAuth();
    };
     window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/mentor');
        console.log('Datos obtenidos:', response.data);
        if (Array.isArray(response.data)) {
          setExpertsData(response.data);
        } else {
          console.error('La respuesta no es un array:', response.data);
        }
      } catch (error) {
        console.error('Error al cargar los mentores:', error);
      }
    };

    fetchMentors();
  }, []);

  const handleHideCard = async (index, isInterested, mentorId) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    const card = document.getElementById(`expert-card-${index}`);
    if (card) {
      card.classList.add('fade-out');

      try {
        // Insertar la selección en la tabla mentoring
        await axios.post('http://localhost:8000/api/mentoring', {
          mentorId: mentorId,
          meInteresa: isInterested
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
  
        console.log('Selección guardada exitosamente');
      } catch (error) {
        console.error('Error al guardar la selección:', error);
      }

      if (isInterested) {
        const newCount = interesCount + 1;
        setInteresCount(newCount);

        if (newCount === 3) {
          setShowMatchModal(true);
        }
      }

      setTimeout(() => {
        setHiddenCards((prev) => [...prev, index]);
        const nextIndex = expertsData.findIndex((_, i) => i >= visibleExperts && !hiddenCards.includes(i));

        if (nextIndex !== -1) {
          setVisibleExperts((prev) => Math.max(prev, nextIndex + 1));
        }
      }, 500);
    }
  };

  const toggleShowAll = () => {
    setShowAll(!showAll);
    if (!showAll) {
      setVisibleExperts(expertsData.length);
    } else {
      setVisibleExperts(5);
    }
  };

  const handleCloseMatchModal = () => {
    setInteresCount(0);
    setShowMatchModal(false);
  };

  const handleRegisterData = () => {
    navigate('/crud-partner');
  };

  const handleNavigateToLogin = () => {
    setShowLoginModal(false);
    navigate('/login');
  };

  if (!Array.isArray(expertsData)) {
    return <div>Error: Los datos de mentores no son válidos.</div>;
  }

  if (!expertsData.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Imagen de fondo con texto */}
      <div
        className="partner-section"
        style={{ backgroundImage: `url(${partnerImage})` }}
      >
        <div className="partner-overlay" />
        <div className="partner-text">
          <h2>
            Reserva a un Partner solicitado <br />
            y genera un trabajo COlaborativo para sacar adelante tu emprendimiento
          </h2>
        </div>
      </div>

      {/* Círculos de expertos */}
      <div className="partner-experts">
        <div className="partner-bottom">
          <p className="partner-subtext">
            Elige a tu socio para hacer match! y recibir su colaboración
          </p>
          <div className="expert-circles">
            <div className="circle" style={{ backgroundImage: `url(${expert1})` }}>
              <p className="circle-text">Todos los expertos</p>
            </div>
            <div className="circle" style={{ backgroundImage: `url(${expert2})` }}>
              <p className="circle-text">Expertos Top</p>
            </div>
            <div className="circle" style={{ backgroundImage: `url(${expert3})` }}>
              <p className="circle-text">Legal y Financiero</p>
            </div>
            <div className="circle" style={{ backgroundImage: `url(${expert4})` }}>
              <p className="circle-text">Ventas</p>
            </div>
            <div className="circle" style={{ backgroundImage: `url(${expert5})` }}>
              <p className="circle-text">Internacionalización</p>
            </div>
          </div>
        </div>
      </div>
      {/* Sección texto */}
      <div className="expert-info bg-white text-center py-10 px-5 mt-8">
        <h3 className="font-montserrat text-3xl font-bold text-black mb-2 text-left">
          Partners al alcance de un Click. Acceder a las mejores soluciones nunca fue tan fácil y accesible
        </h3>
        <div
          className="ver-mas flex items-center justify-start gap-3 mt-4 cursor-pointer transition-transform duration-300 ease-in-out text-left pl-0"
          onClick={toggleShowAll}
        >
          <span className="font-montserrat text-xl text-black font-normal">
            {showAll ? 'Ver menos' : 'Ver más'}
          </span>
          <span className="flecha text-3xl text-black transition-transform duration-300 ease-in-out transform hover:translate-x-2">
            {showAll ? '←' : '→'}
          </span>
        </div>
      </div>

      <div className="expert-cards-container">
        {expertsData.map((mentor, index) => (
          (index < visibleExperts && !hiddenCards.includes(index)) && (
            <div
              key={index}
              id={`expert-card-${index}`}
              className="expert-card show transition-all duration-500 ease-out"
            >
              <div className="relative">
                {/* Contenedor de imagen con manejo de errores */}
                <div className="w-full h-[220px] bg-gradient-to-br from-[#880043] to-[#66B5CB] rounded-xl flex items-center justify-center overflow-hidden">
                  {mentor.image_url ? (
                    <img
                      src={mentor.image_url}
                      alt={`Foto de ${mentor.nombre}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.parentElement.classList.remove("bg-gradient-to-br");
                        e.target.parentElement.classList.add("bg-[#880043]");
                      }}
                    />
                  ) : null}
                  
                  {/* Mostrar inicial si no hay imagen o falla la carga */}
                  {(!mentor.image_url || !mentor.image_url.startsWith('http')) && (
                    <span className="text-white text-6xl font-bold">
                      {mentor.nombre.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                
                <div className="absolute top-2 right-2 text-xl text-red-500 bg-white rounded-full p-1">
                  ❤️
                </div>
              </div>
              
              <h4 className="text-xl font-semibold text-gray-800 my-3">{mentor.nombre} ✔</h4>
              <p className="text-base text-gray-600 my-1">Teléfono: {mentor.telefono}</p>
              <p className="text-base text-gray-600 my-1">Área: {mentor.area_experiencia}</p>
              <p className="text-base text-gray-600 my-1">Disponibilidad: {mentor.disponibilidad}</p>
              
              <div className="flex justify-center gap-2 mt-3">
                <button
                  className="bg-[#880043] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
                  onClick={() => handleHideCard(index, true, mentor.id)}
                >
                  Me interesa
                </button>
                <button
                  className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
                  onClick={() => handleHideCard(index, false, mentor.id)}
                >
                  No interesa
                </button>
              </div>
            </div>
          )
        ))}
      </div>


      {/* Modal de Match */}
      {showMatchModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md w-full mx-4 border-2 border-[#66b5cb] shadow-lg">
            <div className="text-center">
              {/* Icono de corazón simple */}
              <div className="text-[#880043] text-4xl mb-3">❤️</div>
              
              <h3 className="text-3xl font-bold mb-4 text-[#880043]">¡Felicidades!</h3>
              <div className="mb-6">
                <p className="text-lg mb-2 text-[#8d8d8d]">¡Hiciste Match!</p>
                <p className="text-[#66b5cb] font-medium">Pronto se pondrán en contacto contigo</p>
              </div>
              
              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => {
                    handleCloseMatchModal();
                    navigate('/crud-partner');
                  }}
                  className="bg-[#880043] hover:bg-[#6a0034] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Registrar datos
                </button>
                
                <button
                  onClick={handleCloseMatchModal}
                  className="border-2 border-[#66b5cb] text-[#66b5cb] hover:bg-[#f0f9fb] font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login Requerido */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Inicio de sesión requerido</h3>
            <p className="mb-4">Debes iniciar sesión para poder interactuar con los expertos.</p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={handleNavigateToLogin}
                className="bg-[#880043] text-white px-4 py-2 rounded-lg font-medium"
              >
                Ir a Iniciar Sesión
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

       {/* Línea final */}
      <div className="revenue-line"></div>

      {/* Nueva sección con imágenes y texto */}
      <div className="icon-text-section">
        <div className="icon-text-container">
          <div className="icon-text-item">
            <img src={icon1} alt="Asesoramiento Personalizado" className="icon" />
            <p className="icon-title">BUSCA UN PARTNER</p>
            <p className="icon-description">
              Descubre y elige entre nuestra lista de Partners listos para ayudarte y COlaborarte
            </p>
          </div>
          <div className="icon-text-item">
            <img src={icon2} alt="Consultores Internacionales" className="icon" />
            <p className="icon-title">AGENDA UNA VIDEOCONFERENCIA</p>
            <p className="icon-description">
              Selecciona un horario que funcione tanto para ti como para la agenda de tu partner.
            </p>
          </div>
          <div className="icon-text-item">
            <img src={icon3} alt="Soluciones Tecnológicas" className="icon" />
            <p className="icon-title">CONSULTAS VIRTUALES</p>
            <p className="icon-description">
              Únete a la videollamada 1 a 1, haz preguntas y recibe asesoramiento partner.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PartnerSection;