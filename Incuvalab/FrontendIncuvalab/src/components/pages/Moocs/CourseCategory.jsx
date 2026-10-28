// src/components/pages/moocs/CourseCategory.jsx
import React from 'react';
import CourseCard from './CourseCard';
// No es necesario importar transitions.css aquí ya que lo importamos en MoocsPage

const CourseCategory = ({ title, courses }) => {
  return (
    <section className="py-6 md:py-12 fade-in">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#00262D] mb-4 md:mb-8 slide-in">{title}</h2>
        
        {/* Grid responsive más optimizado */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          {courses.map((course, index) => (
            <div 
              key={course.id || index} 
              className="stagger-item"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CourseCard key={index} course={course} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseCategory;