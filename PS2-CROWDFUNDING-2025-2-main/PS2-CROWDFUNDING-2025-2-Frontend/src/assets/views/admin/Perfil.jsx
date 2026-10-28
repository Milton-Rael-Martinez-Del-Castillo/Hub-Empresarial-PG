import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/AdminPerfil.css";
import { FaUser, FaTrash, FaUsers, FaProjectDiagram, FaCheckCircle } from "react-icons/fa";

export default function Perfil() {
  const [openSeguidas, setOpenSeguidas] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  if (!user) return <p>Cargando perfil...</p>;

  const handleLogout = () => {
    ["authToken", "adminToken", "user", "token", "userToken"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    navigate("/");
  };

  return (
    <div className="perfil-container">
      <div className="perfil-left">
        <div className="perfil-avatar">
          {user.ImagenPerfil ? (
            <img className="imgAvatar" src={user.ImagenPerfil} alt="avatar" />
          ) : (
            <span>👤</span>
          )}
        </div>
        <h2>Mi Perfil</h2>
        <h3>{user.Nombre} {user.PrimerApellido}</h3>
        <p className="username">@{user.NombreUsuario}</p>

        <div className="perfil-links">
          <Link to="/configurar-2fa">Configurar Cuenta</Link>
        </div>

        <div className="perfil-info">
          <p><strong>Email:</strong> {user.Correo}</p>
          <p><strong>Número de teléfono:</strong> {user.Telefono || "No registrado"}</p>
          <p><strong>Participa desde:</strong> {new Date(user.FechaCreacion).toLocaleDateString()}</p>

          {/* BOTÓN DE CERRAR SESIÓN */}
          <button className="logout-btn-perfil" onClick={handleLogout} style={{ marginTop: "10px" }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      <div className="perfil-right">
        <h2>Mi Panel de control</h2>
        <div className="panel-section">
          <div
            className="panel-header"
            onClick={() => setOpenSeguidas(!openSeguidas)}
          >
            <h3>Menu de Administracion</h3>
            <span>{openSeguidas ? "˄" : "˅"}</span>
          </div>
          {openSeguidas && (
            <div className="panel-body">
              <div className="dashboard-links">
                <Link to="/admin/proyectos-removidos" className="dashboard-card">
                  <FaTrash className="dashboard-icon" />
                  <h2>Remover Proyectos</h2>
                  <p>Revisa los proyectos eliminados y decide restaurarlos.</p>
                </Link>

                <Link to="/admin/users" className="dashboard-card">
                  <FaUsers className="dashboard-icon" />
                  <h2>Gestión de Usuarios</h2>
                  <p>Administra usuarios: crear, editar o eliminar cuentas.</p>
                </Link>

                <Link to="/admin/proyectos" className="dashboard-card">
                  <FaProjectDiagram className="dashboard-icon" />
                  <h2>Gestión de Proyectos</h2>
                  <p>Controla proyectos activos y pendientes.</p>
                </Link>

                <Link to="/admin/aprobar-proyectos" className="dashboard-card">
                  <FaCheckCircle className="dashboard-icon" />
                  <h2>Aprobar Proyectos</h2>
                  <p>Revisa propuestas y aprueba las que correspondan.</p>
                </Link>

                <Link to="/admin/categorias" className="dashboard-card">
                  <FaProjectDiagram className="dashboard-icon" />
                  <h2>Gestión de Categorías</h2>
                  <p>Agrega, edita o elimina categorías de proyectos.</p>
                </Link>

                <Link to="/admin/asesorias" className="dashboard-card">
                  <FaProjectDiagram className="dashboard-icon" />
                  <h2>Gestión de Asesorías</h2>
                  <p>Agrega, edita o elimina categorías de proyectos.</p>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
