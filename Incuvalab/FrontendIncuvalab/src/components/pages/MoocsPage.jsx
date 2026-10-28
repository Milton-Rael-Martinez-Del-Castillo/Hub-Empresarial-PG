// src/components/pages/MoocsPage.jsx
import React from 'react';
import HeroSearch from '../../components/HeroSearch';
import CourseCategory from '../../components/CourseCategory';
import FilterSection from '../../components/FilterSection';
import { executiveEducationCourses, mastersDegrees, bachelorDegrees, 
         popularCourses, newCourses, trendingCourses, subjectFilters,
         programFilters, schoolFilters } from './Moocs/data';

const MoocsPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroSearch />
      
      <CourseCategory title="Executive Education" courses={executiveEducationCourses} />
      <CourseCategory title="Master's Degrees" courses={mastersDegrees} />
      <CourseCategory title="Bachelor's Degrees" courses={bachelorDegrees} />
      
      {/* Using FilterSection for subjects */}
      <FilterSection 
        title="Filter by popular subjects" 
        type="subjects"
        items={subjectFilters} 
      />
      
      <CourseCategory title="Explore courses and programs" courses={popularCourses} />
      <CourseCategory title="New" courses={newCourses} />
      <CourseCategory title="Trending" courses={trendingCourses} />
      
      {/* Using FilterSection for programs */}
      <FilterSection 
        title="Filter by programs"
        subtitle="Get a degree or certificate with us online"
        type="programs"
        items={programFilters} 
      />
      
      {/* Using FilterSection for schools */}
      <FilterSection 
        title="Filter by popular schools and partners"
        type="schools"
        items={schoolFilters} 
      />
    </div>
  );
};

export default MoocsPage;