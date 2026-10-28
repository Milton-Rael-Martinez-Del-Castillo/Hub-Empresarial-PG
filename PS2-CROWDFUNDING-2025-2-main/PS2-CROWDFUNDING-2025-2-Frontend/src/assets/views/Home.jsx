import React, { useState, useEffect } from 'react';
import { HeroSection } from '../components/HomeComponents';
import { Link } from "react-router-dom";

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [proyectos, setProyectos] = useState([]);

  const loadProjects = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/destacados`);
      const data = await res.json();
      // Asegurarse que siempre sea un array
      setProyectos(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading projects:', err);
      setProyectos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontFamily: "'Be Vietnam Pro', sans-serif"
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 50, height: 50,
            border: '4px solid #F5F5F5',
            borderTop: '4px solid #880430',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }} />
          <p>Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <HeroSection />

      <h2 style={{
        textAlign: 'center',
        margin: '2rem 0',
        fontFamily: "'DM Serif Display', serif",
        fontSize: "30px",
        background: "#66b5cb",
        color: "#fff",
        width: "100%",
        padding: "0.5rem 0",
        borderRadius: "12px"
      }}>
        Proyectos Destacados
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        justifyItems: 'center',
        gap: '25px',
        padding: '0 20px 40px'
      }}>
        {Array.isArray(proyectos) && proyectos.map(p => (
          <div key={p.IdProyecto} style={{
            width: "250px",
            border: '1px solid #ddd',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
            display: 'flex',
            flexDirection: 'column',
            background: '#fff'
          }}>
            <div style={{ padding: "15px" }}>
              <img
                src={p.ImagenPrincipal ? `${import.meta.env.VITE_API_URL}${p.ImagenPrincipal}` : '/default.png'}
                alt={p.Nombre}
                style={{
                  width: '100%',
                  objectFit: 'cover',
                  borderRadius: '12px',
                  border: '1px solid #ccc'
                }}
              />
            </div>

            <div style={{
              padding: '0 18px 18px',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              <h3 style={{ fontSize: "1.3rem", textAlign: 'center', marginBottom: '0.5rem' }}>
                {p.Nombre}
              </h3>

              {p.Categoria && (
                <span style={{ fontSize: '0.85rem', color: '#555' }}>
                  Categoría: <strong>{p.Categoria}</strong>
                </span>
              )}

              <p style={{
                marginTop: "10px",
                fontSize: "0.95rem",
                color: "#444",
                lineHeight: "1.35",
                maxHeight: "4.2em",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}>
                Descripción: {p.DescripcionCorta}
              </p>

              {(p.FechaInicio || p.FechaFin) && (
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '5px' }}>
                  {p.FechaInicio && <>Inicio: {new Date(p.FechaInicio).toLocaleDateString()}</>}
                  {p.FechaFin && <> | Fin: {new Date(p.FechaFin).toLocaleDateString()}</>}
                </div>
              )}

              <p style={{ marginTop: "8px", color: "#555" }}>Seguidores: {p.MeGustas}</p>

              <Link
                to={`/proyecto/${p.IdProyecto}`}
                style={{
                  marginTop: 'auto',
                  alignSelf: 'center',
                  width: '140px',
                  padding: '10px 12px',
                  background: '#66b5cb',
                  color: '#fff',
                  borderRadius: '8px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  fontWeight: '500',
                  transition: '0.15s ease',
                }}
              >
                Ver campaña
              </Link>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin {
          0% { transform: rotate(0) }
          100% { transform: rotate(360deg) }
        }
      `}} />
    </div>
  );
};

export default Home;
