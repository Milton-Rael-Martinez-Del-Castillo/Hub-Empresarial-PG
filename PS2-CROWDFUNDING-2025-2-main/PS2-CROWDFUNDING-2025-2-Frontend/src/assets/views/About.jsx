import { useState } from "react";
import Modal from "@/assets/components/Modal";
import "@/styles/About.css";

const STEPS = [
  {
    id: 1,
    title: "Conoce el crowdfunding",
    kpi: "Empieza con lo más básico",
    img: "https://images.unsplash.com/photo-1604594849809-dfedbc827105?q=80&w=1200&auto=format&fit=crop",
    body: (
      <>
        <p>En IncuVa Lab potenciamos proyectos con networking y mentorías.</p>
        <ul className="ab-list">
          <li>Define objetivos y audiencia.</li>
          <li>Elige el tipo de campaña correcto.</li>
          <li>Traza metas claras y medibles.</li>
        </ul>
      </>
    ),
  },
  {
    id: 2,
    title: "Crea tu perfil",
    kpi: "Diseña tu identidad",
    img: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1200&auto=format&fit=crop",
    body: (
      <>
        <p>Tu perfil es tu carta de presentación ante colaboradores.</p>
        <ul className="ab-list">
          <li>Imagen representativa.</li>
          <li>Historia breve y honesta.</li>
          <li>Canales de contacto.</li>
        </ul>
      </>
    ),
  },
  {
    id: 3,
    title: "Carga tu contenido",
    kpi: "Muestra valor con evidencia",
    img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
    body: (
      <>
        <p>Comparte imágenes, videos y descripciones que convenzan.</p>
        <ul className="ab-list">
          <li>Prototipos / avances.</li>
          <li>Video pitch corto.</li>
          <li>FAQs que despejen dudas.</li>
        </ul>
      </>
    ),
  },
  {
    id: 4,
    title: "Solicita apoyo",
    kpi: "Activa tu comunidad",
    img: "https://images.unsplash.com/photo-1494173853739-c21f58b16055?q=80&w=1200&auto=format&fit=crop",
    body: (
      <>
        <p>Explica cómo pueden aportar (tiempo, experiencia o recursos).</p>
        <ul className="ab-list">
          <li>Convocatorias claras y periódicas.</li>
          <li>Reconoce y agradece.</li>
          <li>Comparte avances.</li>
        </ul>
      </>
    ),
  },
];

export default function About() {
  const [open, setOpen] = useState(null);

  return (
    <div className="ab-wrapper">
      <section className="ab-steps">
        {STEPS.map((s) => (
          <button key={s.id} className="ab-step" onClick={() => setOpen(s.id)}>
            <span className="ab-step__dot">{s.id}</span>
            <div className="ab-step__txt">
              <strong>{s.kpi}</strong>
              <small>{s.title}</small>
            </div>
          </button>
        ))}
        </section>
        <div className="ab-hero">
          <h1>Sobre IncuVa Lab</h1>
          <p>Nuestro sistema no usa dinero como el crowdfunding tradicional.
            <br />
            Aquí los proyectos reciben apoyo a través de mentorías,
            <br />
            seguimiento, contactos y colaboración de profesionales 
            <br />
            que se identifican con su visión.</p>
        </div>
      {STEPS.map((s) => (
        <Modal key={s.id} open={open === s.id} title={s.title} onClose={() => setOpen(null)}>
          <div className="ab-modal__grid">
            <div>{s.body}</div>
            <figure className="ab-illustration">
              <img src={s.img} alt={s.title} />
            </figure>
          </div>
          <div className="ab-modal__actions">
            <button className="ab-btn" onClick={() => setOpen(null)}>Entendido</button>
          </div>
        </Modal>
      ))}
    </div>
  );
}
