import React, { useEffect, useState } from 'react';

const CourseEnrollCTA = ({ course }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // El CTA aparece después de desplazarse más de 400px
      setVisible(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!course) return null;

  return (
    <div 
      className={`
        fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-3 px-4 
        transform transition-transform duration-300 ease-in-out z-40
        ${visible ? 'translate-y-0' : 'translate-y-full'}
      `}
      aria-hidden={!visible}
    >
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="mb-3 sm:mb-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate max-w-xs sm:max-w-md">
            {course.title}
          </h3>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">{course.provider}</span>
            <span className="text-lg font-bold text-[#8B0D37]">
              {course.price ? `$${course.price}` : 'Gratis'}
            </span>
          </div>
        </div>
        <button 
          className="w-full sm:w-auto bg-[#8B0D37] hover:bg-[#6E0B2A] text-white font-medium py-3 px-6 rounded-md transition duration-200 flex items-center justify-center"
          onClick={() => {
            console.log('Inscripción al curso:', course.id);
            // navigate(`/moocs/enrolled/${course.id}`);
          }}
        >
          <span>Inscríbete Ahora</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CourseEnrollCTA;