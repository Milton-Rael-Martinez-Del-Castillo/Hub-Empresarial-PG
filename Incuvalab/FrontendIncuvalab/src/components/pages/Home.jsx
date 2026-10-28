// src/components/pages/Home.jsx
import React from "react";
// Corrige las rutas de importación - solo sube un nivel
import Carousel from "../Carousel";
import ServiceCards from "../ServiceCards";
import SuccessStories from "../SuccessStories";
import ImportantDates from "../ImportantDates";
import SocialMediaGallery from "../SocialMediaGallery";
import InstitutionalBanner from "../InstitutionalBanner";
import VideoHero from "../VideoHero";

function Home() {
  return (
    <>
      <div className="w-full">
        <Carousel />
      </div>
      {/* Contenedor principal con nuevo grid y espaciado */}
      <div className="max-w-[1200px] mx-auto px-12 py-8">
        <div className="grid grid-cols-12 gap-16">
          {/* Área principal - 8 columnas */}
          <div className="col-span-8">
            <ServiceCards />
            <div className="mt-16">
              <ImportantDates />
            </div>
          </div>
          {/* Sidebar - 4 columnas */}
          <div className="col-span-4">
            <SuccessStories />
          </div>
        </div>
        <div className="h-px bg-gray-300 mb-6"></div>
      </div>
      <h2 className="font-montserrat font-normal text-2xl text-center">
        Explora nuestros emprendimientos en redes sociales
      </h2>
      <SocialMediaGallery />
      {/* Banner Institucional con dimensiones controladas por el contenedor */}
      <div className="w-full">
        <InstitutionalBanner />
      </div>

      {/* El VideoHero fuera del contenedor principal para que ocupe ancho completo */}
      <div className="w-full">
        <VideoHero />
      </div>
    </>
  );
}

export default Home;