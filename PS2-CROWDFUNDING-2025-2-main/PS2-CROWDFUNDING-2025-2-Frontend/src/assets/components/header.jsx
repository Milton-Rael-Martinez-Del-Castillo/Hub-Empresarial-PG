import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import "../../styles/Header.css";
import LogoCorto from "../../../public/logo_corto.png";

/** Devuelve true si hay token o user en storage */
const hasSession = () => {
  const token =
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("authToken") ||
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken");
  const user = localStorage.getItem("user") || sessionStorage.getItem("user");
  return !!(token || user);
};

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuth, setIsAuth] = useState(hasSession());
  const navigate = useNavigate();

  // Mantener sincronizado el estado de sesión
  useEffect(() => {
    const sync = () => setIsAuth(hasSession());
    window.addEventListener("storage", sync);
    window.addEventListener("auth-changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth-changed", sync);
    };
  }, []);

  const handleLogout = () => {
    ["authToken", "adminToken", "user", "token", "userToken"].forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
    window.dispatchEvent(new Event("auth-changed"));
    setMenuOpen(false);
    navigate("/");
  };

  const go = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  const linkClass = ({ isActive }) => (isActive ? "active" : "");

  return (
    <header className="header">
      <div className="left-section">
        <div className="logo">
          <Link to="/" onClick={() => setMenuOpen(false)}>
            <img src={LogoCorto} alt="Logo" className="logo-img" />
            IncUVa Lab
          </Link>
        </div>

        <nav id="primary-nav" className={`nav ${menuOpen ? "open" : ""}`}>
          <NavLink
            to="/"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/catalogo-proyectos"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Catálogo de proyectos
          </NavLink>
          <NavLink
            to="/preguntas-frecuentes"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Preguntas Frecuentes
          </NavLink>
          <NavLink
            to="/sobre-nosotros"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            Sobre nosotros
          </NavLink>

          <a
            href="http://localhost:8080"
            className="hub-link"
            onClick={() => setMenuOpen(false)}
          >
            <span aria-hidden="true">←</span>
            Volver al Hub
          </a>

          {/* Acciones en menú hamburguesa (mobile) */}
          <div className="nav-buttons">
            {!isAuth ? (
              <>
                <button className="login-btn" onClick={() => go("/login")}>
                  Iniciar Sesión
                </button>
                <button
                  className="register-btn"
                  onClick={() => go("/register")}
                >
                  Registrarse
                </button>
              </>
            ) : (
              <>
                <button
                  className="profile-mobile"
                  onClick={() => go("/mi-perfil")}
                >
                  Mi perfil
                </button>
                <button className="logout-btn" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* Acciones en desktop */}
      <div className="header-buttons">
        {!isAuth ? (
          <>
            <button
              className="login-btn desktop-btn"
              onClick={() => go("/login")}
            >
              Iniciar Sesión
            </button>
            <button
              className="register-botn desktop-btn"
              onClick={() => go("/register")}
            >
              Registrarse
            </button>
          </>
        ) : (
          <ProfileMenu
            onLogout={handleLogout}
            onGoProfile={() => go("/mi-perfil")}
          />
        )}
      </div>

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={menuOpen}
        aria-controls="primary-nav"
      >
        ☰
      </button>
    </header>
  );
};

export default Header;

/* -------- Subcomponente: menú de perfil (desktop) -------- */
const ProfileMenu = ({ onLogout, onGoProfile }) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const onDocClick = (e) => {
      if (!open) return;
      if (
        btnRef.current &&
        !btnRef.current.contains(e.target) &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div className="profile-menu">
      {/* Botón circular con SVG de usuario centrado */}
      <button
        ref={btnRef}
        className="profile-btn profile-btn--circle"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? "Cerrar menú de perfil" : "Abrir menú de perfil"}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="profile-avatar" aria-hidden>
          {(() => {
            const storedUser =
              JSON.parse(localStorage.getItem("user")) ||
              JSON.parse(sessionStorage.getItem("user"));

            return storedUser?.ImagenPerfil ? (
              <img
                src={storedUser.ImagenPerfil}
                alt="Foto de perfil"
                className="avatar-img"
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />
            ) : (
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path d="M12 12c2.761 0 5-2.686 5-6s-2.239-6-5-6-5 2.686-5 6 2.239 6 5 6zm0 2c-4.418 0-8 2.239-8 5v3h16v-3c0-2.761-3.582-5-8-5z" />
              </svg>
            );
          })()}
        </span>
      </button>

      {open && (
        <div
          ref={menuRef}
          className="profile-dropdown"
          role="menu"
          aria-label="Menú de perfil"
        >
          <button
            role="menuitem"
            onClick={() => {
              setOpen(false);
              onGoProfile();
            }}
          >
            Mi perfil
          </button>
          <button role="menuitem" className="logout-btn" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};
