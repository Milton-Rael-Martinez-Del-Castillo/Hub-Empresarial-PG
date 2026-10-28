// ServiceCards.jsx
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
    <div className="grid grid-cols-3 gap-6"> {/* Reducimos el gap a 6 */}
      {services.map((service, index) => (
        <div 
          key={index} 
          className="relative overflow-hidden rounded-lg cursor-pointer"
        >
          <img 
            src={service.image} 
            alt={service.title}
            className="w-full h-[180px] object-cover" // Ajustamos altura
          />
          <div className={`absolute bottom-0 left-0 right-0 ${service.bgColor} py-3 text-white text-center`}>
            <h3 className="text-lg font-medium tracking-wide">{service.title}</h3>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServiceCards;