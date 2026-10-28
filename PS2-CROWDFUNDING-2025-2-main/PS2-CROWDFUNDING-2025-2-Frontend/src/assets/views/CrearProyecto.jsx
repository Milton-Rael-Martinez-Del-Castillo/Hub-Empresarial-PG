import { useState, useEffect } from "react";
import "../../styles/CrearProyecto.css";
import { Link } from "react-router-dom";

function CrearProyecto() {
  const [formData, setFormData] = useState({
    Nombre: "",
    IdCategoria: "",
    DescripcionCorta: "",
    DescripcionGeneral: "",
    FechaInicio: "",
    FechaFin: "",
    ImagenPrincipal: null,
    ImagenesAdicionales: [],
    Documentos: [],
    Video: "",
    RedesSociales: {
      Facebook: "",
      Instagram: "",
      YouTube: "",
      Twitter: "",
      TikTok: "",
    },
    ResponsableNombre: "",
    ResponsableTelefono: "",
    AsesoriasSeleccionadas: [],
  });

  const [errors, setErrors] = useState({});
  const [categorias, setCategorias] = useState([]);
  const [asesorias, setAsesorias] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/categorias`)
      .then(res => res.json())
      .then(data => setCategorias(data))
      .catch(() =>
        setErrors(prev => ({ ...prev, IdCategoria: "No se pudieron cargar las categorías" }))
      );

    fetch(`${import.meta.env.VITE_API_URL}/api/asesorias/`)
      .then(res => res.json())
      .then(data => setAsesorias(data))
      .catch(err => console.error("Error cargando asesorías:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // --- Archivos ---
    if (files) {
      if (name === "ImagenesAdicionales") {
        if (files.length > 10) {
          setErrors(prev => ({ ...prev, ImagenesAdicionales: "Máximo 10 imágenes" }));
          e.target.value = null;
          setFormData(prev => ({ ...prev, ImagenesAdicionales: [] }));
          return;
        }
        setErrors(prev => ({ ...prev, ImagenesAdicionales: null }));
        return setFormData(prev => ({ ...prev, ImagenesAdicionales: files }));
      }

      if (name === "Documentos") {
        if (files.length > 5) {
          setErrors(prev => ({ ...prev, Documentos: "Máximo 5 documentos" }));
          e.target.value = null;
          setFormData(prev => ({ ...prev, Documentos: [] }));
          return;
        }
        setErrors(prev => ({ ...prev, Documentos: null }));
        return setFormData(prev => ({ ...prev, Documentos: files }));
      }

      if (name === "ImagenPrincipal") {
        return setFormData(prev => ({ ...prev, ImagenPrincipal: files[0] }));
      }
    }

    // --- Asesorías (checkbox múltiple) ---
    if (name === "AsesoriasSeleccionadas") {
      const id = parseInt(value);
      return setFormData(prev => {
        const seleccionadas = prev.AsesoriasSeleccionadas.includes(id)
          ? prev.AsesoriasSeleccionadas.filter(a => a !== id)
          : [...prev.AsesoriasSeleccionadas, id];
        return { ...prev, AsesoriasSeleccionadas: seleccionadas };
      });
    }

    // --- Redes sociales ---
    if (["Facebook", "Instagram", "YouTube", "Twitter", "TikTok"].includes(name)) {
      return setFormData(prev => ({
        ...prev,
        RedesSociales: { ...prev.RedesSociales, [name]: value },
      }));
    }

    // --- Campos normales ---
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    const fechaInicioStr = formData.FechaInicio;
    const fechaFinStr = formData.FechaFin;

    // --- Textos obligatorios ---
    if (!formData.Nombre.trim()) newErrors.Nombre = "El nombre es obligatorio";
    if (!formData.IdCategoria) newErrors.IdCategoria = "Seleccione una categoría";
    if (!formData.DescripcionCorta.trim()) newErrors.DescripcionCorta = "La descripción corta es obligatoria";
    if (!formData.DescripcionGeneral.trim()) newErrors.DescripcionGeneral = "La descripción general es obligatoria";
    if (!formData.ResponsableNombre.trim()) newErrors.ResponsableNombre = "Responsable obligatorio";
    if (!formData.ResponsableTelefono.trim()) {
      newErrors.ResponsableTelefono = "Teléfono obligatorio";
    } else {
      const phone = formData.ResponsableTelefono.replace(/[^0-9]/g, "");
      const boliviaRegex = /^(6|7)[0-9]{7}$/;

      if (!boliviaRegex.test(phone)) {
        newErrors.ResponsableTelefono = "Ingrese un número válido de Bolivia (8 dígitos, comenzando con 6 o 7)";
      }
    }
    if (!formData.ImagenPrincipal) {
      newErrors.ImagenPrincipal = "Debe subir una imagen principal obligatoria";
    }
    // --- Fechas ---
    if (!fechaInicioStr) newErrors.FechaInicio = "Seleccione fecha de inicio";
    else if (fechaInicioStr < todayStr)
      newErrors.FechaInicio = "La fecha de inicio no puede ser anterior a hoy";

    if (!fechaFinStr) newErrors.FechaFin = "Seleccione fecha de fin";
    else if (fechaInicioStr && fechaFinStr) {
      const inicio = new Date(fechaInicioStr);
      const fin = new Date(fechaFinStr);

      if (fin < inicio) newErrors.FechaFin = "La fecha de fin no puede ser menor a la fecha de inicio";

      const minFin = new Date(inicio);
      minFin.setMonth(minFin.getMonth() + 1);

      const maxFin = new Date(inicio);
      maxFin.setFullYear(minFin.getFullYear() + 1);

      if (fin < minFin) newErrors.FechaFin = `La fecha mínima debe ser desde ${minFin.toISOString().split("T")[0]}`;
      if (fin > maxFin) newErrors.FechaFin = `La fecha máxima permitida es ${maxFin.toISOString().split("T")[0]}`;
    }

    // --- Video YouTube ---
    if (formData.Video) {
      const ytPattern = /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i;
      if (!ytPattern.test(formData.Video)) newErrors.Video = "Ingrese una URL válida de YouTube";
    }

    // --- Redes Sociales ---
    const redPatterns = {
      Facebook: /^https?:\/\/(www\.)?facebook\.com\/.+$/i,
      Instagram: /^https?:\/\/(www\.)?instagram\.com\/.+$/i,
      YouTube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+$/i,
      Twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/.+$/i,
      TikTok: /^https?:\/\/(www\.)?tiktok\.com\/.+$/i,
    };

    for (const key in formData.RedesSociales) {
      const url = formData.RedesSociales[key];
      if (url && !redPatterns[key].test(url)) {
        newErrors[key] = `Ingrese una URL válida de ${key}`;
      }
    }

    // --- Archivos ---
    if (formData.ImagenesAdicionales.length > 10) newErrors.ImagenesAdicionales = "Máximo 10 imágenes";
    if (formData.Documentos.length > 5) newErrors.Documentos = "Máximo 5 documentos";
    if (formData.AsesoriasSeleccionadas.length < 1) {
      newErrors.AsesoriasSeleccionadas = "Debe seleccionar al menos 1 asesoría";
    }
    setErrors(newErrors);

    // --- Scroll al primer error ---
    const keys = Object.keys(newErrors);
    if (keys.length > 0) {
      setTimeout(() => {
        const firstErrorField = document.getElementById("field-" + keys[0]);
        if (firstErrorField) {
          firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }

    return keys.length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- Si hay errores de archivos, no enviar ---
    if (errors.ImagenesAdicionales || errors.Documentos) {
      alert("Corrija los errores en las imágenes o documentos antes de enviar.");
      return;
    }

    if (!validateForm()) return;

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return setErrors({ general: "Usuario no encontrado" });

    const data = new FormData();

    for (const key in formData) {
      if (key === "ImagenesAdicionales") {
        Array.from(formData.ImagenesAdicionales).forEach(f => data.append("ImagenesAdicionales", f));
      } else if (key === "Documentos") {
        Array.from(formData.Documentos).forEach(f => data.append("Documentos", f));
      } else if (key === "RedesSociales") {
        const redes = Object.entries(formData.RedesSociales)
          .filter(([_, url]) => url.trim())
          .map(([Tipo, Url]) => ({ Tipo, Url }));
        data.append("RedesSociales", JSON.stringify(redes));
      } else if (key === "AsesoriasSeleccionadas") {
        data.append(key, JSON.stringify(formData[key]));
      } else {
        data.append(key, formData[key]);
      }
    }

    data.append("IdCreador", user.IdUser);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/crear`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();

      if (!res.ok) {
        if (typeof result.error === "object") setErrors(result.error);
        else setErrors({ general: result.error });
        return;
      }

      alert("Proyecto creado correctamente");

      setFormData({
        Nombre: "",
        IdCategoria: "",
        DescripcionCorta: "",
        DescripcionGeneral: "",
        FechaInicio: "",
        FechaFin: "",
        ImagenPrincipal: null,
        ImagenesAdicionales: [],
        Documentos: [],
        Video: "",
        RedesSociales: { Facebook: "", Instagram: "", YouTube: "", Twitter: "", TikTok: "" },
        ResponsableNombre: "",
        ResponsableTelefono: "",
        AsesoriasSeleccionadas: []
      });

      setErrors({});
    } catch (err) {
      setErrors({ general: "Error al crear proyecto" });
    }
  };

  return (
    <div className="crear-proyecto-container">
      <h1>Crear nueva campaña</h1>

      <form onSubmit={handleSubmit} className="crear-proyecto-form">

        <label id="field-Nombre">
          Nombre del Proyecto:
          <input type="text" name="Nombre" value={formData.Nombre} onChange={handleChange} />
          {errors.Nombre && <small className="error">{errors.Nombre}</small>}
        </label>

        <label id="field-IdCategoria">
          Categoría:
          <select name="IdCategoria" value={formData.IdCategoria} onChange={handleChange}>
            <option value="">Seleccione categoría</option>
            {categorias.map(cat => (
              <option key={cat.IdCategoria} value={cat.IdCategoria}>{cat.NombreCategoria}</option>
            ))}
          </select>
          {errors.IdCategoria && <small className="error">{errors.IdCategoria}</small>}
        </label>

        <label id="field-DescripcionCorta">
          Descripción Corta:
          <input
            type="text"
            name="DescripcionCorta"
            value={formData.DescripcionCorta}
            onChange={handleChange}
            maxLength="150"
          />
          {errors.DescripcionCorta && <small className="error">{errors.DescripcionCorta}</small>}
        </label>

        <label id="field-DescripcionGeneral">
          Descripción General:
          <textarea
            name="DescripcionGeneral"
            value={formData.DescripcionGeneral}
            onChange={handleChange}
            rows="4"
          ></textarea>
          {errors.DescripcionGeneral && <small className="error">{errors.DescripcionGeneral}</small>}
        </label>

        <label id="field-ResponsableNombre">
          Responsable:
          <input
            type="text"
            name="ResponsableNombre"
            value={formData.ResponsableNombre}
            onChange={handleChange}
            placeholder="Nombre del responsable"
          />
          {errors.ResponsableNombre && <small className="error">{errors.ResponsableNombre}</small>}
        </label>

        <label id="field-ResponsableTelefono">
          Teléfono Responsable:
          <input
            type="text"
            name="ResponsableTelefono"
            value={formData.ResponsableTelefono}
            onChange={handleChange}
            placeholder="Teléfono del responsable"
          />
          {errors.ResponsableTelefono && <small className="error">{errors.ResponsableTelefono}</small>}
        </label>

        <label id="field-FechaInicio">
          Fecha de Inicio:
          <input type="date" name="FechaInicio" value={formData.FechaInicio} onChange={handleChange} />
          {errors.FechaInicio && <small className="error">{errors.FechaInicio}</small>}
        </label>

        <label id="field-FechaFin">
          Fecha de Fin:
          <input type="date" name="FechaFin" value={formData.FechaFin} onChange={handleChange} />
          {errors.FechaFin && <small className="error">{errors.FechaFin}</small>}
        </label>

        <label id="field-ImagenPrincipal">
          Imagen Principal:
          <input type="file" name="ImagenPrincipal" accept="image/*" onChange={handleChange} />
          {errors.ImagenPrincipal && <small className="error">{errors.ImagenPrincipal}</small>}
        </label>

        <label id="field-ImagenesAdicionales">
          Imágenes Adicionales (hasta 10):
          <input type="file" name="ImagenesAdicionales" accept="image/*" multiple onChange={handleChange} />
          {errors.ImagenesAdicionales && <small className="error">{errors.ImagenesAdicionales}</small>}
        </label>

        <label id="field-Documentos">
          Documentos (PDF, DOCX, XLSX, hasta 5):
          <input type="file" name="Documentos" accept=".pdf,.docx,.xlsx" multiple onChange={handleChange} />
          {errors.Documentos && <small className="error">{errors.Documentos}</small>}
        </label>

        <label id="field-Video">
          Video (URL YouTube, opcional):
          <input
            type="text"
            name="Video"
            value={formData.Video}
            onChange={handleChange}
            placeholder="https://www.youtube.com/..."
          />
          {errors.Video && <small className="error">{errors.Video}</small>}
        </label>

        <fieldset id="field-RedesSociales">
          <legend>Redes Sociales (opcional, máximo 5)</legend>
          {["Facebook", "Instagram", "YouTube", "Twitter", "TikTok"].map(r => (
            <label key={r} id={`field-${r}`}>
              {r}:
              <input type="url" name={r} value={formData.RedesSociales[r]} onChange={handleChange} />
              {errors[r] && <small className="error">{errors[r]}</small>}
            </label>
          ))}
        </fieldset>

        <fieldset id="field-AsesoriasSeleccionadas">
          <legend>Asesorías (seleccione las que necesite)</legend>
          {asesorias.map(a => (
            <label key={a.IdAsesoria}>
              <span>{a.Nombre}</span>
              <input
                type="checkbox"
                name="AsesoriasSeleccionadas"
                value={a.IdAsesoria}
                checked={formData.AsesoriasSeleccionadas.includes(a.IdAsesoria)}
                onChange={handleChange}
              />
            </label>
          ))}
          {errors.AsesoriasSeleccionadas && <small className="error">{errors.AsesoriasSeleccionadas}</small>}
        </fieldset>

        {errors.general && <small className="error">{errors.general}</small>}

        <button type="submit" className="btn-crearP">Crear Proyecto</button>
        <Link to="/mi-perfil">Volver</Link>
      </form>
    </div>
  );
}

export default CrearProyecto;
