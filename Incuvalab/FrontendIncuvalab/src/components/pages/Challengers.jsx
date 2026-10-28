import React, { useState, useEffect } from "react";

const Challenger = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/challenger");
        if (!response.ok) {
          throw new Error("Error al cargar los eventos");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Función para formatear fecha a "OCT 2"
  function formatDate(d) {
    const date = new Date(d);
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const day = date.getDate();
    return { month, day };
  }

  // Filtrar eventos destacados
  const featuredEvents = events.filter(event => event.destacado);

  // Filtrar eventos futuros
  const today = new Date();
  const upcomingEvents = events
    .filter(event => new Date(event.fecha) >= today)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66b5cb] mx-auto"></div>
          <p className="mt-4 text-lg text-[#880043]">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg max-w-md">
          <h3 className="text-xl font-bold text-red-800">Error al cargar eventos</h3>
          <p className="mt-2 text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[#880043] text-white py-2 px-4 rounded hover:bg-opacity-90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Eventos Destacados */}
      <main className="container mx-auto py-8 px-4">
        <h2 className="text-3xl font-bold text-[#880043] mb-6">
          Eventos Destacados del Mes
        </h2>
        {featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow">
                {event.image_url && (
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x225?text=Imagen+no+disponible";
                    }}
                  />
                )}
                <div className="p-4">
                  <h3 className="text-2xl font-bold uppercase text-[#880043]">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    Fecha: {new Date(event.fecha).toLocaleDateString("es-ES", { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </p>
                  <p className="text-gray-600 mt-1">
                    Horario: {event.hora_inicio} - {event.hora_fn}
                  </p>
                  <p className="text-[#8d8d8d] mt-1">
                    Contacto: <a 
                      href={`mailto:${event.contacto_email}`} 
                      className="text-[#66b5cb] hover:underline"
                    >
                      {event.contacto_email}
                    </a>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-lg text-[#8d8d8d]">No hay eventos destacados este mes.</p>
        )}
      </main>

      {/* Calendario de Eventos */}
      <section className="container mx-auto py-8 px-4">
        <div className="bg-[#66b5cb] p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-6">
            Próximos Eventos
          </h2>
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {upcomingEvents.map((event) => {
                const { month, day } = formatDate(event.fecha);
                return (
                  <div
                    key={event.id}
                    className="bg-sky-400 text-white p-4 rounded-lg shadow-lg border-l-4 border-white"
                  >
                    <div className="text-sm font-bold">{month}</div>
                    <div className="text-3xl font-bold">{day}</div>
                    <h3 className="mt-2 font-semibold">{event.title}</h3>
                    <p className="text-sm mt-1 flex items-center">
                      🕒 <span className="ml-1">{event.hora_inicio} - {event.hora_fn}</span>
                    </p>
                    <p className="mt-3 text-sm">
                      Contacto:{" "}
                      <a 
                        href={`mailto:${event.contacto_email}`} 
                        className="underline"
                      >
                        {event.contacto_email}
                      </a>
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-white text-lg">No hay próximos eventos programados.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Challenger;