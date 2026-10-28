import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../../styles/OpcionesCategorias.css"; // reutilizable

export default function EditarAsesoria() {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAsesoria = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/asesorias`);
        const a = res.data.find(a => a.IdAsesoria === parseInt(id));
        if (!a) return alert("Asesoría no encontrada");
        setNombre(a.Nombre);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAsesoria();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/asesorias/${id}`, { Nombre: nombre.trim() });
      alert("Asesoría actualizada correctamente");
      navigate("/admin/asesorias");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar asesoría");
    }
  };

  return (
    <div className="categoria-form-container">
      <Link to="/admin/asesorias" className="btn-volver">← Volver</Link>
      <h2>Editar Asesoría</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        <button type="submit" className="btn-editar">Guardar Cambios</button>
      </form>
    </div>
  );
}
