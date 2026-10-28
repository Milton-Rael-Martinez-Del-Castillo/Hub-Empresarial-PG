const ServiceCards = () => {
  const services = [
    {
      title: "NOTICIAS",
      image: "/img1.jpeg",
      bgColor: "bg-[#87CEEB]"
    },
    {
      title: "EVENTOS",
      image: "/img2.jpeg",
      bgColor: "bg-[#87CEEB]"
    },
    {
      title: "MENTORES",
      image: "/img3.jpeg",
      bgColor: "bg-[#87CEEB]"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service, index) => (
        <div 
          key={index} 
          className="relative overflow-hidden rounded-lg cursor-pointer group"
        >
          <div className="relative overflow-hidden rounded-lg h-[180px]">
            <img 
              src={service.image} 
              alt={service.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-30"></div>
          </div>
          <div className={`absolute bottom-0 left-0 right-0 ${service.bgColor} py-3 text-white text-center transition-all duration-300 group-hover:py-4`}>
            <h3 className="text-lg font-medium tracking-wide transform transition-transform duration-300 group-hover:scale-105">
              {service.title}
            </h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCards;