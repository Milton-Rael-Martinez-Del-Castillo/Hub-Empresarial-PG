// CourseCard.jsx
import React from 'react';

const CourseCard = ({ course }) => {
  const { title, provider, image, logo, type, courseCount } = course;
  
  return (
    <div className="flex flex-col h-full rounded-md overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Background image with logo overlay */}
      <div className="relative h-40 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }}>
        {/* Solo mostrar el logo si existe */}
        {logo && (
          <div className="absolute top-4 left-4 bg-white p-2 rounded-md w-24 h-16 flex items-center justify-center">
            <img src={logo} alt={provider} className="max-w-full max-h-full object-contain" />
          </div>
        )}
      </div>
      
      {/* Course details */}
      <div className="flex-grow flex flex-col p-4 bg-[#00262D] text-white">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm mb-4">{provider}</p>
        
        <div className="mt-auto flex items-center justify-between">
          <span className="px-3 py-1 bg-gray-200 bg-opacity-20 rounded-full text-xs">
            {type}
          </span>
          
          {courseCount && (
            <span className="text-xs text-gray-300">
              {courseCount} Courses
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;