import CourseCard from './CourseCard';

const CourseCategory = ({ title, courses }) => {
    return (
      <section className="py-8 md:py-12">
        <div className="max-w-[1200px] mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#00262D] mb-8">{title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {courses.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </div>
        </div>
      </section>
    );
  };

export default CourseCategory;