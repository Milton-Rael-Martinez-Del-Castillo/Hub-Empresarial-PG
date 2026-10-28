// src/components/pages/moocs/FilterSection.jsx
import React from "react";

const FilterSection = ({
  title,
  subtitle,
  type,
  items,
  activeFilters = [],
  onFilterChange,
}) => {
  // Función para manejar clics en elementos filtrables
  const handleFilterClick = (item) => {
    if (onFilterChange) {
      if (type === "subjects") {
        // Para materias, permitimos múltiples selecciones (toggle)
        if (activeFilters.includes(item.id)) {
          onFilterChange(activeFilters.filter((id) => id !== item.id));
        } else {
          onFilterChange([...activeFilters, item.id]);
        }
      } else if (type === "schools") {
        // Para escuelas, permitimos solo una selección a la vez
        onFilterChange(activeFilters[0] === item.id ? [] : [item.id]);
      }
    }
  };

  // Verificar si un item está activo
  const isActive = (item) => {
    return activeFilters.includes(item.id);
  };

  // Renderizar los filtros de materias
  const renderSubjects = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
      {items.map((subject, index) => (
        <button
          key={subject.id}
          onClick={() => handleFilterClick(subject)}
          className={`flex items-center p-3 rounded-md transition-all duration-300 text-left scale-hover ${
            isActive(subject)
              ? "bg-[#00262D] text-white"
              : "hover:bg-gray-50 text-[#00262D]"
          }`}
          style={{ animationDelay: `${index * 0.05}s` }}
          aria-pressed={isActive(subject)}
        >
          <div className="w-10 h-10 md:w-12 md:h-12 mr-3 flex-shrink-0">
            <img
              src={subject.icon_url}
              alt=""
              className="w-full h-full object-cover"
              aria-hidden="true"
            />
          </div>
          <span className="font-medium text-sm md:text-base">
            {subject.name}
          </span>
        </button>
      ))}
    </div>
  );

  // Renderizar los filtros de escuelas
  const renderSchools = () => (
    <div>
      {items.map((school, schoolIndex) => (
        <div
          key={school.id}
          className="mb-10 fade-in"
          style={{ animationDelay: `${schoolIndex * 0.1}s` }}
        >
          <div className="flex items-center mb-4">
            <h3 className="text-xl font-bold text-[#00262D] slide-in">
              {school.name}
            </h3>
            <button
              onClick={() => handleFilterClick(school)}
              className={`ml-3 px-3 py-1 text-sm rounded-full transition-all duration-300 scale-hover ${
                isActive(school)
                  ? "bg-[#00262D] text-white"
                  : "bg-gray-100 text-[#00262D] hover:bg-gray-200"
              }`}
            >
              {isActive(school) ? "Deselect" : "Select All"}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {school.subjects.map((subject, idx) => (
              <div
                key={idx}
                className="px-5 py-4 bg-gray-50 hover:bg-gray-100 rounded-md text-center text-[#00262D] font-medium transition-colors scale-hover slide-in"
                style={{ animationDelay: `${idx * 0.03}s` }}
              >
                {subject}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section className="py-8 md:py-12 fade-in">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-[#00262D] mb-4 slide-in">
          {title}
        </h2>
        {subtitle && (
          <h3
            className="text-xl font-medium text-[#00262D] mb-8 slide-in"
            style={{ animationDelay: "0.1s" }}
          >
            {subtitle}
          </h3>
        )}

        {type === "subjects" && renderSubjects()}
        {type === "schools" && renderSchools()}

        {/* Mostrar filtros activos y botón para limpiar */}
        {activeFilters.length > 0 && (
          <div className="mt-6 flex items-center slide-in">
            <span className="text-sm text-gray-600 mr-2">Filtros activos:</span>
            <div className="flex flex-wrap gap-2">
              {type === "subjects" &&
                activeFilters.map((id, index) => {
                  const subject = items.find((item) => item.id === id);
                  if (!subject) return null;

                  return (
                    <span
                      key={id}
                      className="px-2 py-1 bg-[#00262D] text-white text-xs rounded-full flex items-center filter-transition"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {subject.name}
                      <button
                        onClick={() => handleFilterClick(subject)}
                        className="ml-1 hover:text-red-300 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}

              {type === "schools" &&
                activeFilters.length > 0 &&
                items.map((school) => {
                  if (!activeFilters.includes(school.id)) return null;

                  return (
                    <span
                      key={school.id}
                      className="px-2 py-1 bg-[#00262D] text-white text-xs rounded-full flex items-center filter-transition"
                    >
                      {school.name}
                      <button
                        onClick={() => handleFilterClick(school)}
                        className="ml-1 hover:text-red-300 transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}

              <button
                onClick={() => onFilterChange([])}
                className="px-2 py-1 border border-gray-300 text-xs rounded-full hover:bg-gray-100 scale-hover transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterSection;
