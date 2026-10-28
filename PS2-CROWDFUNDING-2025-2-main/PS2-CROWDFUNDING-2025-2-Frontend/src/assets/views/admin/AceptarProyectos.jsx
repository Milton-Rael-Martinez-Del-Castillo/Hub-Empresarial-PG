import { useEffect, useState } from "react";
import "../../../styles/AceptarProyectos.css";
import { Link } from "react-router-dom";
function AceptarProyectos() {
  const [proyectos, setProyectos] = useState([]);

  const fetchProyectos = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/pendientes`);
      const data = await res.json();
      setProyectos(data);
    } catch (err) {
      console.error("Error al cargar proyectos pendientes:", err);
    }
  };

  useEffect(() => {
    fetchProyectos();
  }, []);

  const handleAccion = async (id, accion) => {
    let url = "";
    let method = "";
    switch (accion) {
      case "aprobar":
        url = `${import.meta.env.VITE_API_URL}/api/proyectos/aprobar/${id}`;
        method = "PUT";
        break;
      case "cancelar":
        url = `${import.meta.env.VITE_API_URL}/api/proyectos/cancelar/${id}`;
        method = "PUT";
        break;
      case "eliminar":
        url = `${import.meta.env.VITE_API_URL}/api/proyectos/eliminar-logico/${id}`;
        method = "DELETE";
        break;
      default:
        return;
    }

    try {
      const res = await fetch(url, { method });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        fetchProyectos(); // refresca lista
      } else {
        alert(data.error || "Ocurrió un error");
      }
    } catch (err) {
      console.error(err);
      alert("Error en la acción");
    }
  };

  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    return d.toLocaleDateString();
  };

  return (
    <div className="aceptar-proyectos-containers">
      <h2>Aceptar Proyectos</h2>
      <Link to="/admin/perfil">Volver</Link>
      {proyectos.length > 0 ? (
        <div className="proyectos-grids">
          {proyectos.map((p) => (
            <div key={p.IdProyecto} className="proyecto-cards">
              <img
                src={p.ImagenPrincipal ? `${import.meta.env.VITE_API_URL}${p.ImagenPrincipal}` : "/default.png"}
                alt={p.Nombre}
                className="proyecto-imgs"
              />
              <div className="proyecto-bodys">
                <h3>{p.Nombre}</h3>
                <p>{p.DescripcionCorta}</p>
                <small>
                  por {p.NombreCreador} {p.ApellidoCreador}
                </small>
                {(p.FechaInicio || p.FechaFin) && (
                  <div className="proyecto-fechass">
                    {p.FechaInicio && <span>Inicio: {formatFecha(p.FechaInicio)}</span>}
                    {p.FechaFin && <span> | Fin: {formatFecha(p.FechaFin)}</span>}
                  </div>
                )}
                <div className="proyecto-actionss">
                  <button className="btn-verdes" onClick={() => handleAccion(p.IdProyecto, "aprobar")}>
                    Aprobar
                  </button>
                  <button className="btn-amarillos" onClick={() => handleAccion(p.IdProyecto, "cancelar")}>
                    Cancelar
                  </button>
                  <button className="btn-rojos" onClick={() => handleAccion(p.IdProyecto, "eliminar")}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay proyectos pendientes.</p>
      )}
    </div>
  );
}

export default AceptarProyectos;
