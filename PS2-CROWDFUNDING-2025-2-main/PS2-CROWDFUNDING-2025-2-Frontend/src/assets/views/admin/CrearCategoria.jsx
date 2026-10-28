import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/OpcionesCategorias.css";

export default function CrearCategoria() {
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/categorias`, { Nombre: nombre.trim() });
      alert("Categoría creada correctamente");
      navigate("/admin/categorias");
    } catch (err) {
      console.error(err);
      alert("Error al crear categoría");
    }
  };

  return (
    <div className="categoria-form-container">
    <Link to="/admin/categorias" className="btn-volver">← Volver</Link>
    <h2>Crear Nueva Categoría</h2>
    <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        <button type="submit">Crear</button>
    </form>
    </div>
  );
}
