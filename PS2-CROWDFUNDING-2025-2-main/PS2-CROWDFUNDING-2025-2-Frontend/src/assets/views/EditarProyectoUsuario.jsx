import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../../styles/EditarProyectoUsuario.css";

function EditarProyectoUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    Nombre: "",
    DescripcionCorta: "",
    DescripcionGeneral: "",
    Video: "",
    AsesoriasSeleccionadas: [],
  });

  const [videoError, setVideoError] = useState(""); // Nuevo estado para error de video
  const [asesoriasMap, setAsesoriasMap] = useState({}); // id → nombre
  const [imagenesPrincipal, setImagenesPrincipal] = useState(null);
  const [imagenesAdicionales, setImagenesAdicionales] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [completadas, setCompletadas] = useState({});
  const [existingImagenes, setExistingImagenes] = useState([]);
  const [existingDocumentos, setExistingDocumentos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProyecto = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos-usuario/${id}`);
        if (!res.ok) throw new Error("Error al obtener proyecto");
        const proyecto = await res.json();

        const map = {};
        proyecto.AsesoriasSeleccionadas?.forEach(a => map[a.IdAsesoria] = a.Nombre);
        setAsesoriasMap(map);

        const asesoriasSeleccionadas = proyecto.AsesoriasSeleccionadas?.map(a => a.IdAsesoria) || [];

        setForm({
          Nombre: proyecto.Titulo || "",
          DescripcionCorta: proyecto.DescripcionCorta || "",
          DescripcionGeneral: proyecto.DescripcionGeneral || "",
          Video: proyecto.Video || "",
          AsesoriasSeleccionadas: asesoriasSeleccionadas,
        });

        setExistingImagenes(proyecto.ImagenesAdicionales || []);
        setExistingDocumentos(proyecto.Documentos || []);

        const initCompletadas = {};
        proyecto.AsesoriasSeleccionadas?.forEach(a => initCompletadas[a.IdAsesoria] = a.Completada || false);
        setCompletadas(initCompletadas);

      } catch (err) {
        console.error(err);
        setError("Error al cargar el proyecto");
      } finally {
        setLoading(false);
      }
    };

    fetchProyecto();
  }, [id]);

  const handleCheckbox = (idAsesoria) => {
    setCompletadas(prev => ({
      ...prev,
      [idAsesoria]: !prev[idAsesoria]
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Video") {
      // Validación de URL de YouTube
      const youtubeRegex = /^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}(&.*)?$/;
      if (value && !youtubeRegex.test(value)) {
        setVideoError("El enlace debe ser un video de YouTube");
      } else {
        setVideoError("");
      }
    }

    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, setFunc) => setFunc(e.target.files);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (videoError) {
      alert(videoError);
      return;
    }

    try {
      const data = new FormData();
      data.append("Nombre", form.Nombre);
      data.append("DescripcionCorta", form.DescripcionCorta);
      data.append("DescripcionGeneral", form.DescripcionGeneral);
      data.append("Video", form.Video);
      data.append("AsesoriasSeleccionadas", JSON.stringify(form.AsesoriasSeleccionadas));
      data.append("Completadas", JSON.stringify(completadas));

      if (imagenesPrincipal?.[0]) data.append("ImagenPrincipal", imagenesPrincipal[0]);
      for (let img of imagenesAdicionales) data.append("ImagenesAdicionales", img);
      for (let doc of documentos) data.append("Documentos", doc);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos-usuario/editar/${id}`, {
        method: "PUT",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        alert(result.message);
        navigate(`/proyecto/${id}`);
      } else {
        setError(result.error || "Error al actualizar proyecto");
      }
    } catch (err) {
      console.error(err);
      setError("Error al actualizar proyecto");
    }
  };

  if (loading) return <p>Cargando proyecto...</p>;

  return (
    <div className="editar-proyecto-container">
      <h2>Editar Proyecto</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-proyecto">
        <div className="form-group">
          <label>Nombre</label>
          <input type="text" name="Nombre" value={form.Nombre} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Descripción Corta</label>
          <input type="text" name="DescripcionCorta" value={form.DescripcionCorta} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Descripción General</label>
          <textarea name="DescripcionGeneral" value={form.DescripcionGeneral} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Video (URL)</label>
          <input type="text" name="Video" value={form.Video} onChange={handleChange} />
          {videoError && <p className="error">{videoError}</p>}
        </div>

        <div className="form-group">
          <label>Imagen Principal</label>
          <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setImagenesPrincipal)} />
        </div>

        <div className="form-group">
          <label>Imágenes Adicionales</label>
          <input type="file" multiple accept="image/*" onChange={(e) => handleFileChange(e, setImagenesAdicionales)} />
        </div>

        <div className="form-group">
          <label>Documentos</label>
          <input type="file" multiple accept=".pdf,.docx,.xlsx" onChange={(e) => handleFileChange(e, setDocumentos)} />
        </div>

        <div className="form-group asesorias">
          <label>Asesorías</label>
          <div className="checkboxes">
            {Object.entries(asesoriasMap).map(([idAsesoria, nombre]) => (
              <label key={idAsesoria}>
                <input
                  type="checkbox"
                  value={idAsesoria}
                  checked={completadas[idAsesoria] || false}
                  onChange={() => handleCheckbox(Number(idAsesoria))}
                />
                {nombre}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-submit">Actualizar Proyecto</button>
      </form>

      <div className="existing-files">
        {existingImagenes.length > 0 && (
          <div>
            <h3>Imágenes Existentes</h3>
            <div className="imagenes-existentes">
              {existingImagenes.map((img, i) => (
                <img key={i} src={`${import.meta.env.VITE_API_URL}${img.UrlImagen}`} alt={`Imagen ${i + 1}`} />
              ))}
            </div>
          </div>
        )}
        {existingDocumentos.length > 0 && (
          <div>
            <h3>Documentos Existentes</h3>
            <ul>
              {existingDocumentos.map((doc, i) => (
                <li key={i}>
                  <a href={`${import.meta.env.VITE_API_URL}${doc.UrlDocumento}`} target="_blank">{doc.NombreDocumento}</a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default EditarProyectoUsuario;
