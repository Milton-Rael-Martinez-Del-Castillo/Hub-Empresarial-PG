import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../../styles/OpcionesCategorias.css";

export default function EditarCategoria() {
  const { id } = useParams();
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoria = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categorias`);
        const cat = res.data.find(c => c.IdCategoria === parseInt(id));
        if (!cat) return alert("Categoría no encontrada");
        setNombre(cat.Nombre);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategoria();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre.trim()) return alert("El nombre es obligatorio");

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/categorias/${id}`, { Nombre: nombre.trim() });
      alert("Categoría actualizada correctamente");
      navigate("/admin/categorias");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar categoría");
    }
  };

  return (
    <div className="categoria-form-container">
      <Link to="/admin/categorias" className="btn-volver">← Volver</Link>
      <h2>Editar Categoría</h2>
      <form onSubmit={handleSubmit}>
        <label>Nombre:</label>
        <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} />
        <button type="submit" className="btn-editar">Guardar Cambios</button>
      </form>
    </div>
  );
}
