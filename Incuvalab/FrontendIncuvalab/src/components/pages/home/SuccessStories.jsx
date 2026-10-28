// components/SuccessStories.jsx
import React from "react";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      author: "Samuel Doria Medina",
      quote:
        "Muchos quisieran liderar, pero no saben lo que es trabajar. No han liderado ni un emprendimiento",
      image: "/samuel.jpeg",
    },
    {
      id: 2,
      author: "Herbert Vargas",
      quote:
        "Siempre luchen por sus sueños, los sacrificios son dolorosos pero triunfa con gloria ese es un emprendimiento",
      image: "/herbert.jpeg",
    },
  ];

  return (
    <div className="relative mx-4 my-0 max-w-md">
      {" "}
      {/* Añadido max-w-md */}
      {/* Marco completo con líneas */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-[#8B0D37]"></div>
      <div className="absolute top-0 bottom-0 left-0 w-px bg-[#8B0D37]"></div>
      <div className="absolute top-0 bottom-0 right-0 w-px bg-[#8B0D37]"></div>
      <div className="w-full bg-white py-6 px-4">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Casos de éxito
        </h2>
        <div className="h-px bg-[#8B0D37] mb-6"></div>
        {/* Testimonios */}
        <div>
          {stories.map((story, index) => (
            <div key={story.id}>
              <div className="flex gap-4 mb-2">
                <img
                  src={story.image}
                  alt={story.author}
                  className="w-14 h-14 rounded-lg object-cover flex-shrink-0" // Reducido tamaño
                />
                <div className="flex flex-col flex-grow">
                  <p className="text-sm mb-2">"{story.quote}"</p>
                  <p className="text-[#8B0D37] text-sm text-right">
                    • {story.author}
                  </p>
                </div>
              </div>
              {index < stories.length - 1 && (
                <div className="my-6 border-t border-[#8B0D37] opacity-50"></div>
              )}
            </div>
          ))}
        </div>

        {/* Botón */}
        <div className="flex justify-center mt-6">
          <button className="bg-[#8B0D37] text-white px-6 py-2 rounded-md text-sm">
            Más información
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessStories;
