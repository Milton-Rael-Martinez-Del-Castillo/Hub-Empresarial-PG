import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../../styles/CategoriasAdmin.css";

export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategorias = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/categorias`);
      setCategorias(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar esta categoría?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/categorias/${id}`);
      setCategorias(categorias.filter(c => c.IdCategoria !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar categoría");
    }
  };

  if (loading) return <p className="loading">Cargando categorías...</p>;

  return (
    <div className="categorias-container">
      <div className="categorias-header">
        <h2>Administrar Categorías</h2>
        <Link to="/admin/categorias/crear" className="btn-crear">+ Crear Nueva Categoría</Link>
      </div>

      <table className="categorias-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(cat => (
            <tr key={cat.IdCategoria}>
              <td>{cat.Nombre}</td>
              <td>
                <Link 
                  to={`/admin/categorias/editar/${cat.IdCategoria}`} 
                  className="btn-editar"
                >
                  Editar
                </Link>
                <button 
                  onClick={() => handleDelete(cat.IdCategoria)} 
                  className="btn-eliminar"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link to="/admin/perfil" className="btn-volver">← Volver al Panel de Control</Link>
    </div>
  );
}
