import React from "react";
import { Link } from "react-router-dom";

const cardData = [
  {
    title: "MENTORING",
    description:
      "Programa que conecta a colaboradores con mentores expertos para guiarlos en su desarrollo profesional mediante orientación, acompañamiento y transferencia de experiencia.",
    image: "/card1.jpg",
    path: "/mentoring",
  },
  {
    title: "LEARNING",
    description:
      "Espacio dedicado a la formación continua mediante cursos, talleres y recursos educativos que promueven el crecimiento de habilidades técnicas y blandas.",
    image: "/card2.jpg",
    path: "/servicios/moocs",
  },
  {
    title: "INSPIRING",
    description:
      "Iniciativa enfocada en motivar y empoderar a los equipos a través de charlas, eventos y testimonios que impulsan la creatividad, el liderazgo y el compromiso.",
    image: "/card3.jpg",
    path: "/servicios/inspiring",
  },
  {
    title: "PARTNERS",
    description:
      "Espacios diseñados para impulsar la innovación, colaboración y resolución de problemas, invitando a los equipos a salir de su zona de confort.",
    image: "/card4.jpg",
    path: "/servicios/partners",
  },
  {
    title: "CHALLENGER",
    description:
      "Programa que propone retos, buenas prácticas y herramientas clave para fomentar la mejora continua, el diálogo y fomentar una cultura de mejora continua.",
    image: "/card5.jpg",
    path: "/servicios/challengers",
  },
  {
    title: "REVENUE",
    description:
      "Espacio enfocado en el desarrollo de habilidades comerciales y estratégicas para contribuir activamente al crecimiento y sostenibilidad financiera del negocio.",
    image: "/card6.png",
    path: "/servicios/revenue",
  },
];

const Servicios = () => {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cardData.map((card, index) => (
        <Link
          to={card.path}
          key={index}
          className="bg-white rounded-lg shadow-lg overflow-hidden border hover:shadow-xl transition duration-200"
        >
          <img
            src={card.image}
            alt={card.title}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-lg font-bold">{card.title}</h2>
            <p className="text-gray-600 text-sm mt-2">{card.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Servicios;
