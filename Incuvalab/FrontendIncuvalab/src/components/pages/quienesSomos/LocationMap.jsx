// src/components/LocationMap.jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

// Crear un ícono personalizado con FontAwesome
const createCustomIcon = (location) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="marker-container">
        <div class="marker-icon">
          <i class="fas fa-map-marker-alt"></i>
        </div>
        <div class="marker-pulse"></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });
};

const LocationMap = ({ locations }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);
  
  // Centro del mapa (se puede calcular dinámicamente si hay múltiples ubicaciones)
  const mapCenter = locations.length > 0 
    ? [locations[0].lat, locations[0].lng]
    : [-16.5, -68.15]; // Coordenadas por defecto (La Paz, Bolivia)

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-[1200px] mx-auto px-4 md:px-12">
        <h2 className="text-[#8B0D37] text-3xl font-bold mb-4 text-center">Mapas de ubicación y direcciones</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">Encuentra nuestras sedes y puntos de atención</p>
        
        <div className="shadow-2xl h-[600px] rounded-2xl overflow-hidden transform transition-all duration-300 hover:scale-[1.01]">
          <MapContainer 
            center={mapCenter} 
            zoom={15} 
            style={{ height: "100%", width: "100%" }}
            className="z-0"
            zoomControl={false}
          >
            <ZoomControl position="bottomright" />
            
            {/* Mapa base con estilo moderno */}
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            
            {locations.map((location, index) => (
              <Marker
                key={index}
                position={[location.lat, location.lng]}
                eventHandlers={{
                  click: () => setSelectedLocation(location),
                  mouseover: (e) => {
                    e.target.openPopup();
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                  }
                }}
                icon={createCustomIcon(location)}
              >
                <Popup
                  className="custom-popup"
                  closeButton={false}
                  offset={[0, -40]}
                >
                  <div className="p-3 min-w-[250px]">
                    <h3 className="font-bold text-lg text-[#8B0D37]">{location.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{location.address}</p>
                    {location.rating && (
                      <div className="flex items-center mt-2">
                        <span className="text-sm font-semibold mr-1">{location.rating}</span>
                        <div className="flex">
                          {Array(5).fill(0).map((_, i) => (
                            <svg 
                              key={i} 
                              className={`w-4 h-4 ${i < Math.floor(location.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500 ml-1">({location.reviewCount})</span>
                      </div>
                    )}
                    {location.type && (
                      <p className="text-xs text-gray-500 mt-1 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full inline-block">
                        {location.type}
                      </p>
                    )}
                    {location.url && (
                      <a 
                        href={location.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="mt-3 text-sm text-[#8B0D37] hover:text-[#6B0D2D] font-medium flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Ver en el mapa
                      </a>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default LocationMap;