// components/ImportantDates.jsx
import React from "react";

const ImportantDates = () => {
  const dates = [
    {
      id: 1,
      month: "OCT",
      day: "14",
      event: "Avances y Presentaciones",
    },
    {
      id: 2,
      month: "MAR",
      day: "7",
      event: 'Proyecto "Gestión Automatizada"',
    },
    {
      id: 3,
      month: "FEB",
      day: "9",
      event: "Seminario de Introducción",
    },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold">FECHAS IMPORTANTES</h2>
      <div className="mt-4 border-t border-[#66B5CB]">
        {/* Contenedor horizontal */}
        <div className="flex justify-between items-center mt-4">
          {dates.map((date, index) => (
            <div key={date.id} className="flex items-center">
              {/* Fecha */}
              <div className="text-center">
                <div className="text-gray-400 text-sm">{date.month}</div>
                <div className="text-2xl font-bold">{date.day}</div>
              </div>
              
              {/* Línea vertical */}
              <div className="h-8 w-px bg-gray-300 mx-4"></div>
              
              {/* Evento */}
              <div>
                <p className="text-gray-800">{date.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImportantDates;