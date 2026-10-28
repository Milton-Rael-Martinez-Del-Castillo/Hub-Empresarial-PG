import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../../../styles/EditProyecto.css";

function EditarProyecto() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Nombre: "",
    DescripcionCorta: "",
    DescripcionGeneral: "",
    FechaInicio: "",
    FechaFin: "",
    Video: "",
    ImagenPrincipal: null,
  });

  const [preview, setPreview] = useState(null);

  // Cargar datos del proyecto
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/proyectos/${id}`)
      .then((res) => {
        const proyecto = res.data;
        setFormData({
          Nombre: proyecto.Titulo,
          DescripcionCorta: proyecto.DescripcionCorta || "",
          DescripcionGeneral: proyecto.DescripcionGeneral || "",
          FechaInicio: proyecto.FechaInicio?.split("T")[0] || "",
          FechaFin: proyecto.FechaFin?.split("T")[0] || "",
          Video: proyecto.Video || "",
          ImagenPrincipal: null,
        });
        setPreview(proyecto.ImagenPrincipal ? `${import.meta.env.VITE_API_URL}${proyecto.ImagenPrincipal}` : null);
      })
      .catch((err) => {
        console.error(err);
        alert("Proyecto no encontrado");
        navigate("/admin/proyectos"); // Redirige si no existe
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "ImagenPrincipal") {
      if (files[0]) {
        // Liberar URL anterior para evitar fugas de memoria
        if (preview) URL.revokeObjectURL(preview);
        setFormData({ ...formData, ImagenPrincipal: files[0] });
        setPreview(URL.createObjectURL(files[0]));
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });
    data.append("ModificadoPor", 1); // Cambiar al IdUser que edita

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/proyectos/editar/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Proyecto actualizado correctamente");
      navigate("/admin/proyectos"); // Volver al listado
    } catch (err) {
      console.error(err);
      alert("Error al actualizar el proyecto");
    }
  };

  return (
    <div className="crud-containers">
      <h2>Editar Proyecto</h2>
      <form className="form-crud" onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" name="Nombre" value={formData.Nombre} onChange={handleChange} required />

        <label>Descripción corta:</label>
        <input type="text" name="DescripcionCorta" value={formData.DescripcionCorta} onChange={handleChange} />

        <label>Descripción general:</label>
        <textarea name="DescripcionGeneral" value={formData.DescripcionGeneral} onChange={handleChange} required />

        <label>Fecha de inicio:</label>
        <input type="date" name="FechaInicio" value={formData.FechaInicio} onChange={handleChange} />

        <label>Fecha de fin:</label>
        <input type="date" name="FechaFin" value={formData.FechaFin} onChange={handleChange} />

        <label>Video (URL):</label>
        <input type="text" name="Video" value={formData.Video} onChange={handleChange} />

        <label>Imagen principal:</label>
        <input type="file" name="ImagenPrincipal" accept="image/*" onChange={handleChange} />
        {preview && <img src={preview} alt="Preview" className="proyecto-img" />}

        <button type="submit" className="btn-azul">Actualizar Proyecto</button>
      </form>
    </div>
  );
}

export default EditarProyecto;
