// src/assets/views/Faq.jsx
import FaqCard from "../components/faq/FaqCard";
import "../../styles/Faq.css";

const faqs = [
  { 
    question: "¿En qué consiste esta página?",
    answer: "IncuVaLab es una plataforma de apoyo no monetario donde profesionales y estudiantes pueden impulsar proyectos con mentorías, seguimiento y colaboración."
  },
  { 
    question: "¿Cómo puedo ayudar?",
    answer: "Regístrate, explora los proyectos y ofrece apoyo según tus habilidades: mentoría, guía, contactos o participación técnica."
  },
  { 
    question: "¿Es seguro?",
    answer: "El equipo de IncuVaLab verifica los perfiles y supervisa la actividad para asegurar un entorno colaborativo confiable."
  },
  { 
    question: "¿Mi participación puede ser anónima?",
    answer: "Sí, puedes apoyar sin mostrar tu información personal si así lo decides."
  },
  { 
    question: "¿Qué sucede si un proyecto recibe mucho apoyo?",
    answer: "El proyecto puede avanzar más rápido, obtener mayor visibilidad y sumar más mentores o colaboradores."
  },
  { 
    question: "¿Puedo subir mi propio proyecto?",
    answer: "Sí, puedes registrar tu iniciativa, detallar tus objetivos y solicitar apoyo de la comunidad."
  },
  { 
    question: "¿Qué más puedo esperar?",
    answer: "Nueva información, herramientas para creadores, funciones de comunicación y mejoras continuas en la plataforma."
  },
  { 
    question: "¿Hay algún costo para participar?",
    answer: "No. IncuVaLab no maneja dinero; el apoyo es completamente colaborativo y basado en mentorías y networking."
  }
];

export default function Faq() {
  return (
    <section className="faq-section">
      <div className="faq-container">
        <h1 className="faq-heading">Preguntas más frecuentes</h1>
        <div className="faq-underline" />
        <div className="faq-grid">
          {faqs.map((f, i) => <FaqCard key={i} {...f} />)}
        </div>
      </div>
    </section>
  );
}
