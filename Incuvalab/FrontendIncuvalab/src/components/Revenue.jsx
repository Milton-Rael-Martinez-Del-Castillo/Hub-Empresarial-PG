import React from 'react';
import imageSrc from '../assets/inves.png';
import EmpresaImg from '../assets/empresa.jpg';
import laboratorioImage from '../assets/laboratios.jpg';
import mercadoImage from '../assets/mercado.jpg';
import '../styles/Revenue.css';



const Revenue = () => {
  return (
    <>
      {/* Contenedor principal con fondo de imagen */}
      <div className="revenue-container">
        <div className="revenue-content">
          <h2>¿Estás listo para empezar?</h2>
          <p>TRABAJA CON NOSOTROS</p>
        </div>
      </div>

      {/* Subtítulo */}
      <div className="revenue-subtitle">
        🚀 Plataforma de Transferencia Tecnológica
      </div>

      {/* Descripción */}
      <div className="revenue-description">
        ¿Tenés una idea, producto o desafío técnico y no sabés por dónde empezar?<br />
        Esta plataforma está pensada para ayudarte.
      </div>

      <div className="revenue-description">
        Actuamos como un puente entre empresas, emprendedores y centros de conocimiento,<br />
        permitiendo el levantamiento de solicitudes tecnológicas para impulsar nuevos desarrollos,<br />
        mejorar procesos o buscar soluciones a medida.
      </div>

      {/* Línea negra debajo */}
      <div className="revenue-line"></div>

      {/* Nueva sección con imagen y texto */}
      <div className="revenue-investigadores">
        <img src={imageSrc} alt="Investigadores" />
        <div className="investigadores-text">
          <h2>INVESTIGADORES</h2>
          <p>
            Desarrollo de servicios enfocados a académicos e investigadores para el fortalecimiento de las capacidades de gestión, 
            de emprendimiento de equipos de investigación y desarrollo de investigaciones con enfoque a necesidades del entorno.
          </p>
        </div>
      </div>

      {/* Nuevo subtítulo */}
      <div className="revenue-asesoramiento">
        ASESORAMIENTO PARA EL ANÁLISIS DE OPORTUNIDADES DE TRANSFERENCIA TECNOLÓGICA
      </div>

      {/* Lista de asesoramiento */}
      <ul className="revenue-lista-asesoramiento">
        <li>Desarrollo de reportes de vigilancia tecnológica</li>
        <li>Análisis de viabilidad técnico-comercial</li>
        <li>Desarrollo de propuestas de protección intelectual</li>
        <li>Desarrollo de estrategias de transferencia para uso comercial/industrial</li>
        <li>Consejería en negociación de contratos de transferencia</li>
      </ul>

      {/* Botón centrado */}
      <div className="revenue-boton-container">
        <button className="revenue-boton">Contacta con nosotros</button>
      </div>

      <div className="revenue-line"></div>

         {/* Nueva sección con imagen y texto */}
        <div className="revenue-investigadores">
        <img src={EmpresaImg} alt="Investigadores" />
        <div className="investigadores-text">
          <h2>EMPRESAS</h2>
          <p>
            Desarrollo de servicios enfocados a empresas industriales, comerciales y de servicios,intesadas en
            gestionar estratégicamente la vigilancia tecnologíca empresarial e inteligencia competitiva para lograr
            su identifación como líderes del sector por su enfoque de innovación.
          </p>
        </div>
      </div>

      {/* Nuevo subtítulo */}
      <div className="revenue-asesoramiento">
        ASESORAMIENTO ESTRATEGICO EN GESTIÓN DE LA TRANSFERENCIA TECNOLÓGICA
      </div>

      {/* Lista de asesoramiento */}
      <ul className="revenue-lista-asesoramiento">
        <li>Elaboración de estrategias de protección intelectual</li>
        <li>Scouting de tecnologías</li>
        <li>Vigilancia tecnológica</li>
        <li>Monitoreo de competencia o actores relevantes del sector</li>
        <li>Búsqueda del estado de la técnica</li>
      </ul>

      {/* Botón centrado */}
      <div className="revenue-boton-container">
        <button className="revenue-boton">Contacta con nosotros</button>
      </div>
      <div className="revenue-line"></div>
        {/* Sección Laboratorios */}
        <div className="revenue-investigadores">
            <img src={laboratorioImage} alt="Laboratorios" />
            <div className="investigadores-text">
                <h2>LABORATORIOS</h2>
                <p>
                Servicios diseñados para laboratorios académicos, clínicos o de investigación, enfocados en potenciar la gestión del conocimiento, la vigilancia tecnológica y la transferencia de resultados científicos hacia aplicaciones innovadoras.
                </p>
            </div>
        </div>

        {/* Subtítulo Asesoramiento Laboratorios */}
        <div className="revenue-asesoramiento">
        ASESORAMIENTO ESTRATÉGICO PARA LABORATORIOS EN GESTIÓN DE INNOVACIÓN Y TRANSFERENCIA DE CONOCIMIENTO
        </div>

        {/* Lista Laboratorios */}
        <ul className="revenue-lista-asesoramiento">
        <li>Protección y valorización de resultados de investigación</li>
        <li>Mapeo de tecnologías emergentes</li>
        <li>Vigilancia científica y tecnológica</li>
        <li>Identificación de oportunidades de colaboración o licenciamiento</li>
        <li>Búsqueda de antecedentes técnicos y científicos</li>
        </ul>

    
        {/* Botón */}
        <div className="revenue-boton-container">
        <button className="revenue-boton">Contacta con nosotros</button>
        </div>

        <div className="revenue-line"></div>
                {/* Sección Mercado */}
        <div className="revenue-investigadores">
        <img src={mercadoImage} alt="Mercado" />
        <div className="investigadores-text">
            <h2>MERCADO</h2>
            <p>
            Aceleramos la conexión entre laboratorios y el mercado, brindando servicios especializados para transformar investigaciones, desarrollos o prototipos en productos viables, competitivos y comercializables. Facilitamos el camino desde la idea hasta su posicionamiento en la industria.
            </p>
        </div>
        </div>

        {/* Subtítulo Asesoramiento para salida al mercado */}
        <div className="revenue-asesoramiento">
        ESTRATEGIAS PARA POSICIONAR TU INNOVACIÓN EN EL MERCADO
        </div>

        {/* Lista de apoyo al ingreso al mercado */}
        <ul className="revenue-lista-asesoramiento">
        <li>Protección y valorización de resultados de investigación</li>
        <li>Estudios de mercado y análisis de viabilidad comercial</li>
        <li>Diseño de modelo de negocio y propuesta de valor</li>
        <li>Vinculación con aliados estratégicos y fondos de financiamiento</li>
        <li>Asesoría para la transferencia, licenciamiento o escalado del producto</li>
        </ul>

        {/* Botón */}
        <div className="revenue-boton-container">
        <button className="revenue-boton">Contacta con nosotros</button>
        </div>

    </>
  );
};

export default Revenue;