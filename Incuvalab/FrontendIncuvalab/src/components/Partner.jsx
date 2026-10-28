import React from 'react';
import partnerImage from '../assets/oratoria.jpg';
import expert1 from '../assets/experto1.jpg';
import expert2 from '../assets/experto2.jpg';
import expert3 from '../assets/experto3.jpg';
import expert4 from '../assets/experto4.jpg';
import expert5 from '../assets/experto5.png';
import profile1 from '../assets/profile1.jpg'; 
import profile2 from '../assets/profile2.jpg';
import profile3 from '../assets/profile3.jpg';
import profile5 from '../assets/profile5.jpg';
import profile6 from '../assets/profile6.jpg';
import profile7 from '../assets/profile7.jpg';
import profile8 from '../assets/profile8.jpg';
import profile9 from '../assets/profile9.jpg';
import profile10 from '../assets/profile10.jpg';
import profile11 from '../assets/profile11.jpg';
import icon1 from '../assets/icon1.png';
import icon2 from '../assets/icon2.png';
import icon3 from '../assets/icon3.png';

import '../styles/Partners.css';

const expertsData = [
  { image: profile1, name: 'María Fernández', price: '$80 por sesión', role: 'Fundadora de EcoVision' },
  { image: profile2, name: 'Carlos Díaz', price: '$90 por sesión', role: 'Fundador de FinTechPro' },
  { image: profile3, name: 'Laura Gómez', price: '$70 por sesión', role: 'Fundadora de HealthWay' },
  { image: profile5, name: 'Sofía Ramos', price: '$85 por sesión', role: 'Fundadora de EduPlus' },
  { image: profile6, name: 'Daniela Ruiz', price: '$75 por sesión', role: 'Fundadora de TravelNow' },
  { image: profile7, name: 'Martín Gómez', price: '$80 por sesión', role: 'Fundador de FinTechUp' },
  { image: profile8, name: 'Camila Ortega', price: '$70 por sesión', role: 'Fundadora de HealthFirst' },
  { image: profile9, name: 'Luis Fernández', price: '$90 por sesión', role: 'Fundador de EduPro' },
  { image: profile10, name: 'Valeria Soto', price: '$85 por sesión', role: 'Fundadora de GreenImpact' },
  { image: profile11, name: 'Diego Rivas', price: '$95 por sesión', role: 'Fundador de LegalFlow' }  
];

const PartnerSection = () => {
  const firstSixExperts = expertsData.slice(0, 5);
  const lastExperts = expertsData.slice(5);

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
            y tener poder un trabajo COlaborativo para poder sacar adelante tu emprendimiento
          </h2>
        </div>
      </div>

      {/* Círculos de expertos */}
      <div className="partner-experts">
        <div className="partner-bottom">
          <p className="partner-subtext">
            Elige un experto para hacer match! y recibir su colaboración
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

      {/* Texto nivel experto */}
      <div className="expert-info">
        <h3>Partners de primer nivel. Acceder a las mejores soluciones nunca fue tan fácil y accesible</h3>
        <div className="ver-mas">
          <span>Ver más</span>
          <span className="flecha">➜</span>
        </div>
      </div>

      {/* Cards de expertos 1 al 6 */}
      <div className="expert-cards-container">
        {firstSixExperts.map((expert, index) => (
          <div key={index} className="expert-card">
            <div className="image-container">
              <img src={expert.image} alt={expert.name} className="expert-image" />
              <div className="favorite-icon">❤️</div>
            </div>
            <h4 className="expert-name">{expert.name} ✔</h4>
            <p className="expert-price">{expert.price}</p>
            <p className="expert-role">{expert.role}</p>
            <div className="expert-buttons">
              <button className="btn-interesa">Me interesa</button>
              <button className="btn-no-interesa">No me interesa</button>
            </div>
          </div>
        ))}
      </div>

      {/* Texto final */}
      <div className="expert-info">
        <h3>Inicia. Accede a una red de partners dispuestos a poder ayudarte en tú negocio!</h3>
        <div className="ver-mas">
          <span>Ver más</span>
          <span className="flecha">➜</span>
        </div>
      </div>

      {/* Cards de expertos 7 al 11 */}
      <div className="expert-cards-container">
        {lastExperts.map((expert, index) => (
          <div key={index} className="expert-card">
            <div className="image-container">
              <img src={expert.image} alt={expert.name} className="expert-image" />
              <div className="favorite-icon">❤️</div>
            </div>
            <h4 className="expert-name">{expert.name} ✔</h4>
            <p className="expert-price">{expert.price}</p>
            <p className="expert-role">{expert.role}</p>
            <div className="expert-buttons">
              <button className="btn-interesa">Me interesa</button>
              <button className="btn-no-interesa">No me interesa</button>
            </div>
          </div>
        ))}
      </div>

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
