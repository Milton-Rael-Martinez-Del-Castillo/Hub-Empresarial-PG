import React, { useRef, useState, useEffect } from "react";
import { FaPlay } from "react-icons/fa";

function VideoHero() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const overlayVideoRef = useRef(null);
  const backgroundVideoRef = useRef(null);

  // Precargar y optimizar videos
  useEffect(() => {
    // Precargar video del modal (ahora en formato webm)
    const modalVideo = document.createElement('video');
    modalVideo.src = "/videos/incuvalab2.webm";
    modalVideo.preload = "auto";
    modalVideo.playsInline = true;
    
    // Configuración para máxima fluidez
    modalVideo.onloadeddata = () => {
      setIsVideoReady(true);
      console.log("Video WEBM precargado y listo");
    };

    modalVideo.onwaiting = () => setIsBuffering(true);
    modalVideo.onplaying = () => setIsBuffering(false);
    modalVideo.onerror = (e) => console.error("Error al cargar video:", e);

    // Optimizar video de fondo
    if (backgroundVideoRef.current) {
      backgroundVideoRef.current.defaultPlaybackRate = 1.0;
      backgroundVideoRef.current.playbackRate = 1.0;
    }

    return () => {
      modalVideo.onloadeddata = null;
      modalVideo.onwaiting = null;
      modalVideo.onplaying = null;
    };
  }, []);

  const handlePlayVideo = () => {
    if (!isVideoReady) return;
    
    setIsPlaying(true);
    
    // Forzar hardware acceleration y configuración óptima
    setTimeout(() => {
      if (overlayVideoRef.current) {
        overlayVideoRef.current.defaultPlaybackRate = 1.0;
        overlayVideoRef.current.playbackRate = 1.0;
        
        // Configuración para máxima fluidez
        overlayVideoRef.current.playsInline = true;
        overlayVideoRef.current.muted = false;
        
        const playPromise = overlayVideoRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Reproducción WEBM iniciada con éxito");
              // Configuración avanzada para mantener fps
              requestAnimationFrame(() => {
                overlayVideoRef.current.currentTime = overlayVideoRef.current.currentTime;
              });
            })
            .catch(e => console.error("Error al reproducir:", e));
        }
      }
    }, 150); // Pequeño retraso para permitir renderizado
  };

  const handleCloseModal = () => {
    if (overlayVideoRef.current) {
      overlayVideoRef.current.pause();
      overlayVideoRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsBuffering(false);
  };

  // Control de teclado y optimizaciones
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isPlaying) handleCloseModal();
    };
    
    document.addEventListener("keydown", handleKeyDown);
    
    // Limpieza de recursos
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (overlayVideoRef.current) {
        overlayVideoRef.current.pause();
        overlayVideoRef.current.removeAttribute('src');
        overlayVideoRef.current.load();
      }
    };
  }, [isPlaying]);

  return (
    <div className="relative w-full h-[472px] overflow-hidden">
      {/* Video de fondo optimizado */}
      <video
        ref={backgroundVideoRef}
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      >
        <source src="/videos/incuvalab.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento de video.
      </video>

      {/* Capa oscura */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 z-10"></div>

      {/* Contenido principal */}
      <div className="relative z-20 w-full h-full flex items-center justify-center gap-10 px-8 md:px-16 max-w-[1400px] mx-auto">
        <div className="max-w-md">
          <h2 className="text-white text-2xl md:text-3xl font-semibold leading-tight">
            "Una institución donde cualquiera puede buscar instrucción en sus estudios"
          </h2>
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={handlePlayVideo}
            aria-label="Reproducir video"
            disabled={!isVideoReady}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-2 border-white transition-all mb-3 ${
              isVideoReady 
                ? "bg-white bg-opacity-20 hover:bg-opacity-30 cursor-pointer" 
                : "bg-gray-500 bg-opacity-30 cursor-not-allowed"
            }`}
          >
            <FaPlay className={`text-xl ml-1 ${
              isVideoReady ? "text-white" : "text-gray-400"
            }`} />
          </button>
          <span className="text-white font-medium tracking-wide text-xs md:text-sm">
            EXPERIENCIA UNIVALLE
          </span>
          {!isVideoReady && (
            <span className="text-xs text-white mt-1">Cargando video...</span>
          )}
        </div>
      </div>

      {/* Modal de video ultra fluido */}
      {isPlaying && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative bg-black rounded-lg overflow-hidden shadow-lg w-full max-w-[90vw] lg:max-w-[80vw] xl:max-w-[70vw] 2xl:max-w-[60vw]">
            {/* Botón de cierre */}
            <button
              onClick={handleCloseModal}
              aria-label="Cerrar video"
              className="absolute top-3 right-4 text-white text-3xl font-bold z-10 hover:text-red-400 transition-colors"
            >
              ✕
            </button>

            {/* Indicador de carga */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
              </div>
            )}

            {/* Video optimizado para 60fps en formato WEBM */}
            <video
              ref={overlayVideoRef}
              className="w-full h-auto max-h-[90vh]"
              controls
              autoPlay
              playsInline
              preload="auto"
              disablePictureInPicture
              disableRemotePlayback
              onWaiting={() => setIsBuffering(true)}
              onPlaying={() => setIsBuffering(false)}
            >
              <source src="/videos/incuvalab2.webm" type="video/webm" />
              <source src="/videos/incuvalab2.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoHero;