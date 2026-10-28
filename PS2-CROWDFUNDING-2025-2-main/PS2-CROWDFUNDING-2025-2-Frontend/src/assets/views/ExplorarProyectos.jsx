import { useEffect, useState } from "react";
import "../../styles/Explorar.css";
import { Link } from "react-router-dom";

function ExplorarProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [user, setUser] = useState(null);
  const [seguidos, setSeguidos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [categorias, setCategorias] = useState([]);

  // Función para formatear fecha
  const formatFecha = (fecha) => {
    if (!fecha) return "";
    const d = new Date(fecha);
    return d.toLocaleDateString();
  };

  // Cargar usuario y proyectos seguidos
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/donados/${storedUser.IdUser}`)
        .then((res) => res.json())
        .then((data) => setSeguidos(data.map((p) => p.IdProyecto)))
        .catch((err) => console.error(err));
    }
  }, []);

  // Cargar categorías dinámicamente
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/categorias`)
      .then((res) => res.json())
      .then((data) => setCategorias(data))
      .catch((err) => console.error("Error al cargar categorías:", err));
  }, []);

  // Cargar proyectos según búsqueda y categoría
  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/api/proyectos/buscar?nombre=${busqueda}&idCategoria=${categoriaFiltro}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => setProyectos(data))
      .catch((err) => console.error("Error al cargar proyectos:", err));
  }, [busqueda, categoriaFiltro]);

  // Seguir un proyecto
  const handleSeguir = async (IdProyecto) => {
    if (!user) return alert("Debes iniciar sesión para seguir una campaña");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/seguir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdUser: user.IdUser, IdProyecto }),
      });
      const data = await res.json();

      if (data.error) alert(data.error);
      else setSeguidos((prev) => [...prev, IdProyecto]);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al seguir la campaña");
    }
  };

  // Quitar seguimiento
  const handleQuitar = async (IdProyecto) => {
    if (!user) return alert("Debes iniciar sesión");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/seguir`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdUser: user.IdUser, IdProyecto }),
      });
      const data = await res.json();

      if (data.error) alert(data.error);
      else setSeguidos((prev) => prev.filter((id) => id !== IdProyecto));
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al quitar el me gusta");
    }
  };

  return (
    <div className="explorar-container">
      <h2 className="explorar-header">Catálogo de Proyectos</h2>

      {/* Buscador y filtro */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar proyecto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="buscador"
        />

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="select-categoria"
        >
          <option value="">Todas las categorías</option>
          {categorias.map((cat) => (
            <option key={cat.IdCategoria} value={cat.IdCategoria}>
              {cat.NombreCategoria || "Sin nombre"}
            </option>
          ))}
        </select>
      </div>

      {proyectos.length > 0 ? (
        <div className="proyectos-grid">
          {proyectos.map((p) => {
            const yaSeguido = seguidos.includes(p.IdProyecto);
            const nombreProyecto = p.Nombre || "Proyecto sin título";
            const categoria = p.Categoria || "Sin categoría";
            const imagenSrc = p.ImagenPrincipal
              ? `${import.meta.env.VITE_API_URL}${p.ImagenPrincipal}`
              : "/default.png";

            return (
              <div key={p.IdProyecto} className="proyecto-card">
                <img src={imagenSrc} alt={nombreProyecto} className="proyecto-img" />
                <div className="proyecto-body">
                  <h4>{nombreProyecto}</h4>
                  <span className="proyecto-tag"><strong>Categoría: </strong>{categoria}</span>
                  <p><strong>Descripción: </strong>{p.DescripcionCorta || "Sin descripción"}</p>
                  {(p.FechaInicio || p.FechaFin) && (
                    <div className="proyecto-fechas">
                      {p.FechaInicio && <span>Inicio: {formatFecha(p.FechaInicio)}</span>}
                      {p.FechaFin && <span> | Fin: {formatFecha(p.FechaFin)}</span>}
                    </div>
                  )}
                  <div className="proyecto-actions">
                    {yaSeguido ? (
                      <button className="btn-rojoss" onClick={() => handleQuitar(p.IdProyecto)}>
                        Siguiendo
                      </button>
                    ) : (
                      <button className="btn-verde" onClick={() => handleSeguir(p.IdProyecto)}>
                        Seguir
                      </button>
                    )}
                    <Link className="btn-azul" to={`/proyecto/${p.IdProyecto}`}>
                      Ver campaña
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p>No hay campañas disponibles.</p>
      )}
    </div>
  );
}

export default ExplorarProyectos;
