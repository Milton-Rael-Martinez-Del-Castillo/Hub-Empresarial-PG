import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import MainLayout from "./assets/layouts/MainLayout";
import PrivateRoute from "./assets/components/PrivateRoute";

// Importación para auto-logout
import { initAutoLogout } from "./utils/auth";

// Vistas públicas
import Home from "./assets/views/Home";
import Faq from "./assets/views/Faq";
import About from "./assets/views/About";
import Login from "./assets/views/login";
import Register from "./assets/views/register";
import ExplorarProyectos from "./assets/views/ExplorarProyectos";
import CrearProyecto from "./assets/views/CrearProyecto";

// Vistas administración
import UsersAdmin from "./assets/views/UsersAdmin";
import CrudProyectos from "./assets/views/admin/CrudProyectos";
import AceptarProyectos from "./assets/views/admin/AceptarProyectos";
import ProyectosRemovidos from "./assets/views/admin/ProyectosRemovidos";
import Perfil from "./assets/views/admin/Perfil";
import Configurar2FA from "./assets/views/Configurar2FA";
import Profile from "./assets/views/Profile";
import EditarProyecto from "./assets/views/admin/EditarProyecto";
import VerProyecto from "./assets/views/VerProyecto.jsx";

// Vistas CRUD Categorías
import CategoriasAdmin from "./assets/views/admin/CategoriasAdmin";
import CrearCategoria from "./assets/views/admin/CrearCategoria";
import EditarCategoria from "./assets/views/admin/EditarCategoria";

import AsesoriasAdmin from "./assets/views/admin/AsesoriasAdmin";
import CrearAsesoria from "./assets/views/admin/CrearAsesoria";
import EditarAsesoria from "./assets/views/admin/EditarAsesoria";
import EditarProyectoUsuario from "./assets/views/EditarProyectoUsuario";

// Componente wrapper para manejar logout dentro del Router
function AppWrapper() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Carga usuario y activa auto-logout
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
    setLoading(false);

    initAutoLogout();
  }, []);

  // Escuchar cambios de auth (login/logout)
  useEffect(() => {
    const handleAuthChange = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    };
    const handleLogout = () => navigate("/login");

    window.addEventListener("auth-changed", handleAuthChange);
    window.addEventListener("logout", handleLogout);

    return () => {
      window.removeEventListener("auth-changed", handleAuthChange);
      window.removeEventListener("logout", handleLogout);
    };
  }, [navigate]);

  if (loading) return <p>Cargando...</p>;

  return (
    <Routes>
      {/* ----------------- Rutas públicas dentro de MainLayout ----------------- */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/preguntas-frecuentes" element={<Faq />} />
        <Route path="/sobre-nosotros" element={<About />} />
        <Route path="/catalogo-proyectos" element={<ExplorarProyectos />} />
        <Route path="/proyecto/:id" element={<VerProyecto />} />
        <Route
          path="/mi-perfil"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Route>

      <Route
        path="/usuario/editar-proyecto/:id"
        element={
          <PrivateRoute>
            <EditarProyectoUsuario />
          </PrivateRoute>
        }
      />
      <Route path="/Crear-Campania" element={<CrearProyecto />} />

      {/* Rutas de admin usando PrivateRoute con role={1} */}
      <Route
        path="/admin/editar/:id"
        element={
          <PrivateRoute role={1}>
            <EditarProyecto />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/perfil"
        element={
          <PrivateRoute role={1}>
            <Perfil />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <PrivateRoute role={1}>
            <UsersAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/proyectos"
        element={
          <PrivateRoute role={1}>
            <CrudProyectos />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/aprobar-proyectos"
        element={
          <PrivateRoute role={1}>
            <AceptarProyectos />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/proyectos-removidos"
        element={
          <PrivateRoute role={1}>
            <ProyectosRemovidos />
          </PrivateRoute>
        }
      />

      {/* Rutas CRUD Categorías */}
      <Route
        path="/admin/categorias"
        element={
          <PrivateRoute role={1}>
            <CategoriasAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/categorias/crear"
        element={
          <PrivateRoute role={1}>
            <CrearCategoria />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/categorias/editar/:id"
        element={
          <PrivateRoute role={1}>
            <EditarCategoria />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/asesorias"
        element={
          <PrivateRoute role={1}>
            <AsesoriasAdmin />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/asesorias/crear"
        element={
          <PrivateRoute role={1}>
            <CrearAsesoria />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/asesorias/editar/:id"
        element={
          <PrivateRoute role={1}>
            <EditarAsesoria />
          </PrivateRoute>
        }
      />

      {/* Rutas protegidas para cualquier usuario */}
      <Route
        path="/configurar-2fa"
        element={
          <PrivateRoute>
            <Configurar2FA userId={user?.IdUser} />
          </PrivateRoute>
        }
      />

      {/* ----------------- Rutas login/register ----------------- */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login setUser={setUser} />
          ) : user.Id_Rol === 1 ? (
            <Navigate to="/admin/perfil" />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/register"
        element={
          !user ? (
            <Register setUser={setUser} />
          ) : user.Id_Rol === 1 ? (
            <Navigate to="/admin/perfil" />
          ) : (
            <Navigate to="/profile" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
