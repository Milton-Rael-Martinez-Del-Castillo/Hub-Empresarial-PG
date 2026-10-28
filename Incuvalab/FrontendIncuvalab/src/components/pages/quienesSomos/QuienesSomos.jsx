// src/components/pages/QuienesSomos.jsx
import React from "react";
import HeroBanner from "./HeroBanner";
import MissionStatement from "./MissionStatement";
import CampusLocations from "./CampusLocations";
import UniversityProfile from "./UniversityProfile";
import LocationMap from "./LocationMap";

const locationData = [
    {
      name: "INCUVALAB - Universidad Univalle",
      address: "Av. América, Cochabamba, Bolivia",
      lat: -17.371345,
      lng: -66.158654,
      rating: 4.5,
      reviewCount: 126,
      type: "Centro de Emprendimiento",
      url: "https://www.openstreetmap.org/search?query=-17.371345%2C-66.158654",
      iconUrl: "/images/marker-incuvalab.png"
    }
  ];

function QuienesSomos() {
  return (
    <div>
      {/* Hero Banner */}
      <HeroBanner 
        imageSrc="/images/acercaIncuvalab/incuvalab-building.png" 
        title="Bienvenido a INCUVALAB" 
      />
      
      {/* Declaración de misión */}
      <MissionStatement />
      
      {/* Campus y ubicaciones */}
      <CampusLocations />

      {/* Perfil de la Universidad */}
      <UniversityProfile />
      
      {/* Mapa de ubicación */}
      <LocationMap locations={locationData} />
    </div>
  );
}

export default QuienesSomos;