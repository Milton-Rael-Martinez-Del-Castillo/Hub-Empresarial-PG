// src/components/pages/moocs/CourseCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// En CourseCard.jsx
const CourseCard = ({ course }) => {
  // Adaptación de nombres de campos
  const { 
    id,
    title, 
    provider, 
    image_url: image,
    logo_url: logo,   
    type, 
    course_count: courseCount
  } = course;
  
  return (
    <Link 
      to={`/servicios/moocs/${id}`}
      className="block text-current no-underline"
    >
      <article className="flex flex-col h-full rounded-md overflow-hidden shadow-md border border-gray-100 hover:shadow-lg transition-shadow card-hover">
        <div className="relative h-40 bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${image})` }}>
          <div className="absolute inset-0 img-zoom" style={{ backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} aria-hidden="true"></div>
          
          {logo && (
            <div className="absolute top-4 left-4 bg-white p-2 rounded-md w-24 h-16 flex items-center justify-center z-10">
              <img src={logo} alt={`Logo de ${provider}`} className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>
        
        <div className="flex-grow flex flex-col p-4 bg-[#00262D] text-white">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm mb-4">{provider}</p>
          
          <div className="mt-auto flex items-center justify-between">
            <span className="px-3 py-1 bg-gray-200 bg-opacity-20 rounded-full text-xs">
              {type}
            </span>
            
            {courseCount && (
              <span className="text-xs text-gray-300">
                {courseCount} Cursos
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default CourseCard;