import "../../styles/Footer.css";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h4>Nuestra Sección</h4>
          <Link to="/sobre-nosotros">Sobre Nosotros</Link>
          <a href="https://www.univalle.edu/?page_id=4115" target="_blank" rel="noopener noreferrer">Orgullo Univalle</a>
        </div>

        <div className="footer-section">
          <h4>Te Ayudamos</h4>
          <Link to="/preguntas-frecuentes">Preguntas</Link>
        </div>
        <div className="footer-section">
          <h4>Visita Tambien</h4>
          <a href="https://www.univalle.edu/" target="_blank" rel="noopener noreferrer">Univalle Oficial</a>
          <a href="https://www.univalle.edu/?page_id=150" target="_blank" rel="noopener noreferrer">Eres un Estudiante Nuevo</a>
          <a href="https://www.univalle.edu/?page_id=440" target="_blank" rel="noopener noreferrer">Más sobre Univalle</a>
        </div>

        <div className="footer-section socials-section">
          <h4>Síguenos En Nuestras Redes</h4>
          <div>
            <a href="https://www.facebook.com/UnivalleBolivia/" className="facebook" target="_blank" rel="noopener noreferrer"><FaFacebook size={30} /></a>
            <a href="https://www.instagram.com/univalle_bolivia/" className="instagram" target="_blank" rel="noopener noreferrer"><FaInstagram size={30} /></a>
            <a href="https://x.com/univallebolivia" className="twitter" target="_blank" rel="noopener noreferrer"><FaTwitter size={30}/></a>
            <a href="https://www.youtube.com/@univallebolivia" className="youtube" target="_blank" rel="noopener noreferrer"><FaYoutube size={30}/></a>
            <a href="https://www.tiktok.com/@univallebolivia" className="tiktok" target="_blank" rel="noopener noreferrer"><FaTiktok size={30}/></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 IncuvaLab. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
