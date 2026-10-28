import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import "dayjs/locale/es";

dayjs.locale("es");

const meses = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

export default function Eventos() {
  const [mesActivo, setMesActivo] = useState("ENERO");
  const [showModal, setShowModal] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modoEditar, setModoEditar] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const [confirmarEliminar, setConfirmarEliminar] = useState(false);
  const [minDate, setMinDate] = useState("");

  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    fecha_evento: "",
    hora: "",
    lugar: ""
  });

  const [eventos, setEventos] = useState([]);

  useEffect(() => {
    // Establecer la fecha mínima como hoy (sin horas/minutos/segundos)
    const today = dayjs().startOf('day').format("YYYY-MM-DD");
    setMinDate(today);
    obtenerEventos();
  }, []);

  const obtenerEventos = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/eventos");
      setEventos(res.data);
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      setModalMensaje("Error al cargar eventos");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const seleccionarEvento = (evento) => {
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha_evento: dayjs(evento.fecha_evento).format("YYYY-MM-DD"),
      hora: evento.hora,
      lugar: evento.lugar
    });
    setEventoSeleccionado(evento);
    setModoEditar(true);
  };

  const resetForm = () => {
    setFormData({
      titulo: "",
      descripcion: "",
      fecha_evento: "",
      hora: "",
      lugar: ""
    });
    setEventoSeleccionado(null);
    setModoEditar(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación de fecha futura
    const fechaSeleccionada = dayjs(formData.fecha_evento);
    const hoy = dayjs().startOf('day');
    
    if (fechaSeleccionada.isBefore(hoy)) {
      setModalMensaje("No puedes agendar eventos en fechas pasadas");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      return;
    }

    if (!formData.titulo || !formData.fecha_evento || !formData.lugar) {
      setModalMensaje("Faltan campos requeridos: título, fecha y lugar son obligatorios");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
      return;
    }

    try {
      const datosEnviar = {
        ...formData,
        administrador_id: "1"
      };

      let response;
      if (modoEditar && eventoSeleccionado) {
        response = await axios.put(
          `http://localhost:8000/api/eventos/${eventoSeleccionado.id}`,
          datosEnviar
        );
        setModalMensaje("¡Evento actualizado!");
      } else {
        response = await axios.post(
          "http://localhost:8000/api/eventos",
          datosEnviar
        );
        setModalMensaje("¡Evento guardado!");
      }

      resetForm();
      obtenerEventos();
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Error al guardar/actualizar evento", error);
      const mensajeError = error.response?.data?.message || 
                         error.response?.data?.error || 
                         "Error al procesar la solicitud";
      setModalMensaje(mensajeError);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  const eliminarEvento = async () => {
    if (!eventoSeleccionado) return;
    
    try {
      await axios.delete(`http://localhost:8000/api/eventos/${eventoSeleccionado.id}`);
      setModalMensaje("¡Evento eliminado correctamente!");
      resetForm();
      obtenerEventos();
      setConfirmarEliminar(false);
      setShowModal(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      setModalMensaje("Error al eliminar el evento");
      setShowModal(true);
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  const eventosPorMes = (mes) => {
    return eventos.filter((evento) => {
      const mesEvento = dayjs(evento.fecha_evento).format("MMMM").toUpperCase();
      return mesEvento === mes;
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-5 flex flex-col lg:flex-row gap-6">
      <div className="w-full lg:w-1/2 px-10">
        <h2 className="text-3xl font-bold text-center mb-8">EVENTOS 2025</h2>
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-cyan-500 rounded"></div>

          {meses.map((mes, index) => (
            <div
              key={mes}
              className={`relative w-full flex ${index % 2 === 0 ? "justify-start pr-20" : "justify-end pl-20"} mb-8`}
            >
              <div className="w-64">
                <div
                  className="px-4 py-2 bg-cyan-500 text-white text-sm font-semibold rounded-md hover:bg-cyan-600 transition cursor-pointer text-center"
                  onClick={() => setMesActivo((prev) => (prev === mes ? "" : mes))}
                >
                  {mes}
                </div>

                {mesActivo === mes && (
                  <div className="bg-white mt-2 p-4 text-sm rounded shadow border border-gray-200">
                    <div className="font-semibold text-gray-800">Eventos:</div>
                    <ul className="list-disc list-inside text-gray-700">
                      {eventosPorMes(mes).length > 0 ? (
                        eventosPorMes(mes).map((evento) => (
                          <li
                            key={evento.id}
                            className="cursor-pointer hover:text-cyan-600"
                            onClick={() => seleccionarEvento(evento)}
                          >
                            <strong>{evento.titulo}</strong> – {dayjs(evento.fecha_evento).format("DD/MM/YYYY")} – {evento.lugar}
                          </li>
                        ))
                      ) : (
                        <li>No hay eventos para este mes.</li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full lg:w-2/3 bg-[#880043] shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          {modoEditar ? "EDITAR EVENTO" : "AGREGAR NUEVO EVENTO"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <label className="block mb-1">Nombre del Evento</label>
            <input
              type="text"
              name="titulo"
              placeholder="Nombre del evento"
              value={formData.titulo}
              onChange={handleChange}
              required
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              placeholder="Descripción"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full p-2 rounded text-black"
              rows="3"
            />
          </div>

          <div>
            <label className="block mb-1">Fecha</label>
            <input
              type="date"
              name="fecha_evento"
              value={formData.fecha_evento}
              onChange={handleChange}
              required
              min={minDate}
              className="w-full p-2 rounded text-black"
            />
            <p className="text-xs text-cyan-200 mt-1">
              Solo se permiten fechas futuras (a partir de {dayjs(minDate).format("DD/MM/YYYY")})
            </p>
          </div>

          <div>
            <label className="block mb-1">Hora</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              className="w-full p-2 rounded text-black"
            />
          </div>

          <div>
            <label className="block mb-1">Lugar</label>
            <input
              type="text"
              name="lugar"
              placeholder="Lugar"
              value={formData.lugar}
              onChange={handleChange}
              className="w-full p-2 rounded text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-cyan-600 transition-colors"
          >
            {modoEditar ? "Actualizar Evento" : "Guardar Evento"}
          </button>

          {modoEditar && (
            <button
              type="button"
              onClick={() => setConfirmarEliminar(true)}
              className="w-full bg-[#c64376] text-white py-2 rounded hover:bg-[#4d0025] transition-colors mt-2"
            >
              Eliminar Evento
            </button>
          )}
        </form>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
            <h2 className="text-xl font-bold mb-2 text-green-700">{modalMensaje}</h2>
            <p className="text-gray-700">La operación se completó correctamente.</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {confirmarEliminar && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
            <h2 className="text-xl font-bold mb-2 text-[#880043]">¿Eliminar evento?</h2>
            <p className="text-gray-700 mb-4">¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setConfirmarEliminar(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarEvento}
                className="px-4 py-2 bg-[#880043] text-white rounded hover:bg-[#6a0034] focus:bg-[#6a0034] focus:outline-none focus:ring-2 focus:ring-[#880043] focus:ring-opacity-50 transition-colors"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}