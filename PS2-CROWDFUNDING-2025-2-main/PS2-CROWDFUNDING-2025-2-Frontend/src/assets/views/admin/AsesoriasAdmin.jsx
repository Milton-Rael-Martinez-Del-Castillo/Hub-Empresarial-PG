import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../../../styles/CategoriasAdmin.css"; // puedes crear AsesoriasAdmin.css si quieres

export default function AsesoriasAdmin() {
  const [asesorias, setAsesorias] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAsesorias = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/asesorias`);
      setAsesorias(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error cargando asesorías:", err);
    }
  };

  useEffect(() => {
    fetchAsesorias();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro quieres eliminar esta asesoría?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/asesorias/${id}`);
      setAsesorias(asesorias.filter(a => a.IdAsesoria !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar asesoría");
    }
  };

  if (loading) return <p className="loading">Cargando asesorías...</p>;

  return (
    <div className="categorias-container">
      <div className="categorias-header">
        <h2>Administrar Asesorías</h2>
        <Link to="/admin/asesorias/crear" className="btn-crear">+ Crear Nueva Asesoría</Link>
      </div>

      <table className="categorias-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asesorias.map(a => (
            <tr key={a.IdAsesoria}>
              <td>{a.Nombre}</td>
              <td>
                <Link to={`/admin/asesorias/editar/${a.IdAsesoria}`} className="btn-editar">
                  Editar
                </Link>
                <button onClick={() => handleDelete(a.IdAsesoria)} className="btn-eliminar">
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
