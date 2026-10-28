import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/OpcionesCategorias.css"; // reutilizable

export default function CrearAsesoria() {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/asesorias`, { Nombre: nombre.trim() });
      alert("Asesoría creada correctamente");
      navigate("/admin/asesorias");
    } catch (err) {
      console.error(err);
      alert("Error al crear asesoría");
    }
  };

  return (
    <div className="categoria-form-container">
      <Link to="/admin/asesorias" className="btn-volver">← Volver</Link>
      <h2>Crear Nueva Asesoría</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        <button type="submit">Crear</button>
      </form>
    </div>
  );
}
