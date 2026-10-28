import React, { useState } from "react";
import { Play, Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const VideoPlayer = ({ videoUrl, title }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Función para convertir URL de YouTube a formato embed
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;

    try {
      let videoId = null;

      // Formato: https://www.youtube.com/watch?v=VIDEO_ID
      if (url.includes("youtube.com/watch")) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get("v");
      }
      // Formato: https://youtu.be/VIDEO_ID
      else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split(/[?&]/)[0];
      }
      // Formato: https://youtube.com/embed/VIDEO_ID (ya está en formato embed)
      else if (url.includes("youtube.com/embed/")) {
        return url;
      }

      // Si encontramos el ID, devolver la URL de embed
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (error) {
      console.error("Error al procesar URL de YouTube:", error);
      setError(true);
    }

    return null;
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  if (!embedUrl || error) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          URL de video no válida o no soportada. Por favor, verifica que sea una URL válida de YouTube.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-[#F8E6ED] rounded-lg">
          <Play className="h-5 w-5 text-[#8B0D37]" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Video de la lección</h3>
          <p className="text-sm text-slate-600">Contenido principal del tema</p>
        </div>
      </div>

      <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 shadow-inner">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-10">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-[#8B0D37] mx-auto mb-2" />
              <p className="text-sm text-slate-600">Cargando video...</p>
            </div>
          </div>
        )}
        <iframe
          src={embedUrl}
          title={title}
          width="100%"
          height="100%"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="rounded-xl"
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setError(true);
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;