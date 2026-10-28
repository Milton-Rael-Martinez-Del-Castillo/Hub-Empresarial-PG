import React from 'react';

const CourseNavTabs = ({ activeTab, setActiveTab }) => {
  // Definición de las pestañas disponibles
  const tabs = [
    { id: 'overview', label: 'Descripción general' },
    { id: 'syllabus', label: 'Programa' },
    { id: 'instructors', label: 'Instructores' },
    { id: 'resources', label: 'Recursos' },
    { id: 'faq', label: 'Preguntas frecuentes' }
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <div className="flex flex-wrap -mb-px">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              mr-1 py-4 px-4 font-medium text-sm sm:text-base border-b-2 transition-colors duration-200
              focus:outline-none focus:ring-2 focus:ring-[#8B0D37] focus:ring-opacity-50
              ${activeTab === tab.id 
                ? 'border-[#8B0D37] text-[#8B0D37]' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            `}
            aria-current={activeTab === tab.id ? 'page' : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CourseNavTabs;