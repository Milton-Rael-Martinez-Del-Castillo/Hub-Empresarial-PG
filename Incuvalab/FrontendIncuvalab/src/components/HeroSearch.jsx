import React from 'react';

const HeroSearch = () => {
  const trendingTags = ["Python", "Excel", "Data Sciences", "Marketing"];
  
  return (
    <div className="w-full bg-[#00262D] py-12 px-4 md:py-16">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-white text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Construye tus Skills. Certificate.<br/>
          Mejora tu carrera de Emprendedor.
        </h1>
        
        <div className="flex w-full max-w-lg">
          <input 
            type="text" 
            placeholder="What do you want to learn?" 
            className="flex-grow p-3 text-gray-700 rounded-l-md border-0 focus:ring-2 focus:ring-[#8B0D37]"
          />
          <button className="bg-[#8B0D37] hover:bg-[#6E0B2A] text-white px-6 py-3 rounded-r-md transition-colors">
            Search
          </button>
        </div>
        
        <div className="flex items-center mt-5 flex-wrap gap-2">
          <span className="text-white font-medium mr-2">Trending:</span>
          <div className="flex flex-wrap gap-2">
            {trendingTags.map((tag, index) => (
              <a 
                key={index} 
                href={`#${tag.toLowerCase()}`}
                className="px-3 py-1 bg-gray-700 bg-opacity-30 text-white rounded-md text-sm hover:bg-opacity-50 transition-colors"
              >
                {tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSearch;