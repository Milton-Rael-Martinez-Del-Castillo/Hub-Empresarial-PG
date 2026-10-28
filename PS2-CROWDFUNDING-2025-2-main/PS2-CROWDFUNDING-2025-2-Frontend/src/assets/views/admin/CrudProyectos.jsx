import { useEffect, useState } from "react";
import axios from "axios";
import "../../../styles/CrudProyectos.css";
import { Link } from "react-router-dom";

function CrudProyectosAdmin() {
  const [proyectos, setProyectos] = useState([]);

  useEffect(() => {
    // Cargar todos los proyectos activos
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/proyectos/todos`)
      .then((res) => setProyectos(res.data))
      .catch((err) => console.error("Error al cargar proyectos:", err));
  }, []);

  const eliminarProyecto = async (id) => {
    if (!confirm("¿Seguro que quieres eliminar este proyecto?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/proyectos/eliminar/${id}`);
      setProyectos(proyectos.filter((p) => p.IdProyecto !== id));
    } catch (err) {
      alert("Error al eliminar el proyecto");
    }
  };

  return (
    <div className="crud-container">
      <div className="crud-header">
        <h2>Proyectos</h2>
        <br />
      </div>
      <div>
                <Link className="link-removidos" to="/admin/perfil">Volver al Panel de Control</Link>
      </div>
      {proyectos.length > 0 ? (
        <div className="proyectos-grid">
          {proyectos.map((p) => (
            <div key={p.IdProyecto} className="proyecto-card">
              <img
                src={p.ImagenPrincipal ? `${import.meta.env.VITE_API_URL}${p.ImagenPrincipal}` : "/default.png"}
                alt={p.Titulo}
                className="proyecto-img"
              />
              <h3>{p.Titulo}</h3>
              <p>{p.DescripcionCorta}</p>
              <small>
                Creado por {p.NombreCreador} {p.ApellidoCreador}
              </small>
              <div className="proyecto-actions">
                <button className="btn-rojo" onClick={() => eliminarProyecto(p.IdProyecto)}>Remover</button>
                <button className="btn-azul" onClick={() => window.location.href = `/admin/editar/${p.IdProyecto}`}>
                  Editar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No hay proyectos activos.</p>
      )}
    </div>
  );
}

export default CrudProyectosAdmin;
