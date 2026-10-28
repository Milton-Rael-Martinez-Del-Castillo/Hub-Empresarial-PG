import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "../../styles/VerProyecto.css";

// Función para obtener el ícono según la red social
const getSocialIcon = (url) => {
  if (!url) return null;
  url = url.toLowerCase();
  if (url.includes("facebook.com")) return "fab fa-facebook-f";
  if (url.includes("twitter.com") || url.includes("x.com")) return "fab fa-twitter";
  if (url.includes("instagram.com")) return "fab fa-instagram";
  if (url.includes("linkedin.com")) return "fab fa-linkedin-in";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "fab fa-youtube";
  if (url.includes("tiktok.com")) return "fab fa-tiktok";
  return "fas fa-link";
};

// Función para convertir cualquier URL de YouTube a formato embed
const getEmbedUrl = (url) => {
  if (!url) return null;
  const match1 = url.match(/v=([a-zA-Z0-9_-]{11})/);
  if (match1) return `https://www.youtube.com/embed/${match1[1]}`;
  const match2 = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (match2) return `https://www.youtube.com/embed/${match2[1]}`;
  return null;
};

export default function VerProyecto() {
  const { id } = useParams();
  const [proyecto, setProyecto] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState(null);
  const [seguido, setSeguido] = useState(false);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/explorar/${id}`);
        if (!res.ok) throw new Error("Error al obtener proyecto");
        const data = await res.json();
        setProyecto(data);
      } catch (err) {
        console.error(err);
        alert("No se pudo cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [id]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);

      fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/donados/${storedUser.IdUser}`)
        .then(res => res.json())
        .then(data => {
          const yaSeguido = data.some(p => p.IdProyecto === parseInt(id));
          setSeguido(yaSeguido);
        })
        .catch(err => console.error(err));
    }
  }, [id]);

  const handleSeguir = async () => {
    if (!user) return alert("Debes iniciar sesión para seguir este proyecto");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/seguir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdUser: user.IdUser, IdProyecto: id }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else setSeguido(true);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al seguir el proyecto");
    }
  };

  const handleQuitar = async () => {
    if (!user) return alert("Debes iniciar sesión para quitar el seguimiento");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/seguir`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ IdUser: user.IdUser, IdProyecto: id }),
      });
      const data = await res.json();
      if (data.error) alert(data.error);
      else setSeguido(false);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al quitar el seguimiento");
    }
  };

  if (loading) return <p>Cargando proyecto...</p>;
  if (!proyecto) return <p>Proyecto no encontrado</p>;

  return (
    <div className="verproyecto-container">
      {/* Título y botón de seguir */}
      <div className="titulo-seguir-container">
        {seguido ? (
          <button className="btn-rojosss" onClick={handleQuitar}>Siguiendo</button>
        ) : (
          <button className="btn-negro" onClick={handleSeguir}>Seguir</button>
        )}
        <h1>{proyecto.Titulo}</h1>
      </div>

      {/* Categoría */}
      {proyecto.Categoria && <p className="categoria">Categoría: {proyecto.Categoria}</p>}
      
      {/* Fechas */}
      <div className="fechas">
        {proyecto.FechaInicio && <span>Inicio: {new Date(proyecto.FechaInicio).toLocaleDateString()}</span>}
        {proyecto.FechaFin && <span> | Fin: {new Date(proyecto.FechaFin).toLocaleDateString()}</span>}
        <p className="seguidores-count">Seguidores: {proyecto.Seguidores}</p>
      </div>

      {/* Video e imagen principal */}
      <div className="media-section">
        {proyecto.Video && (
          <iframe
            src={getEmbedUrl(proyecto.Video)}
            title="Video del proyecto"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        )}
        {proyecto.ImagenPrincipal && (
          <img
            src={`${import.meta.env.VITE_API_URL}${proyecto.ImagenPrincipal}`}
            alt={proyecto.Titulo}
            className="imagen-principal"
          />
        )}
      </div>

      {/* Descripción */}
      <h3>Descripción General</h3>
      <p>{proyecto.DescripcionGeneral}</p>

      {/* Imágenes adicionales */}
      {proyecto.ImagenesAdicionales?.length > 0 && (
        <div>
          <h3>Imágenes Del Proyecto</h3>
          <div className="imagenes-adicionales">
            {proyecto.ImagenesAdicionales.map((img, index) => (
              <img
                key={index}
                src={`${import.meta.env.VITE_API_URL}${img.UrlImagen}`}
                alt={`Imagen ${index + 1}`}
              />
            ))}
          </div>
        </div>
      )}
      {/* Asesorías seleccionadas */}
      {proyecto.AsesoriasSeleccionadas?.length > 0 && (
        <div className="asesorias-seleccionadas">
          <h3>Requisitos del proyecto</h3>
          <ul>
            {proyecto.AsesoriasSeleccionadas.map((a) => (
              <li key={a.IdAsesoria}>
                {a.Completada ? "✅ " : ""}{a.Nombre}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Documentos */}
      {proyecto.Documentos?.length > 0 && (
        <div>
          <h3>Documentos</h3>
          <ul>
            {proyecto.Documentos.map((doc, index) => (
              <li key={index}>
                <a
                  href={`${import.meta.env.VITE_API_URL}${doc.UrlDocumento}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {doc.NombreDocumento} ({doc.TipoDocumento})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Responsable */}
      <div className="responsable">
        <h3>Contactanos</h3>
        <p>
          Correo Electrónico: {proyecto.CorreoCreador} <br />
          WhatsApp:{" "}
          <a
            href={`https://wa.me/${proyecto.ResponsableTelefono.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {proyecto.ResponsableTelefono}
          </a>
        </p>
      </div>
      {/* Creador */}
      <div className="creador">
        <h3>Encargado</h3>
        <div className="creador-info">
          <span>{proyecto.ResponsableNombre}</span>
        </div>
      </div>

      {/* Redes sociales */}
      {proyecto.RedesSociales?.length > 0 && (
        <div className="redes-sociales">
          <h3>Síguenos en nuestras redes</h3>
          <div className="redes-icons">
            {proyecto.RedesSociales.map((r, i) => (
              <a
                key={i}
                href={r.Url}
                target="_blank"
                rel="noopener noreferrer"
                className="red-social-link"
              >
                <i className={getSocialIcon(r.Url)}></i>
              </a>
            ))}
          </div>
        </div>
      )}
      <br />
      <Link to="/catalogo-proyectos" className="btn-volver">← Volver</Link>
    </div>
  );
}
