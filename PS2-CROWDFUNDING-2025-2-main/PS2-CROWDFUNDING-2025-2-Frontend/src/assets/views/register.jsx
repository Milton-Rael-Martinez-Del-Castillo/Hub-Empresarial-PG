import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const firstName = e.target.firstName.value.trim();
    const lastName = e.target.lastName.value.trim();
    const secondLastName = e.target.secondLastName?.value.trim() || "";
    const username = e.target.username?.value.trim() || firstName.toLowerCase() + Date.now();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const confirmPassword = e.target.confirmPassword.value;
    const phone = e.target.phone?.value.trim() || "";

    // Validación de contraseñas
    if (password !== confirmPassword) {
      alert("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    // Validación de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Correo inválido");
      setLoading(false);
      return;
    }

    // Validación de teléfono opcional (Bolivia)
    if (phone && !/^(?:\+591)?[67]\d{7}$/.test(phone)) {
      alert("Número de teléfono inválido");
      setLoading(false);
      return;
    }

    const formData = {
      firstName,
      lastName,
      secondLastName,
      username,
      email,
      password,
      phone,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error en el registro");
      }

      const data = await res.json();
      console.log("Usuario creado:", data);

      alert("Usuario registrado con éxito");
      navigate("/login");
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      alert(error.message || "Ocurrió un error al registrar el usuario");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-wrapper">
          {/* Sección de bienvenida */}
          <div className="welcome-section">
            <h1>¡Bienvenido!</h1>
            <p>Estamos a tu disposición para ayudarte</p>
            <div className="login-prompt">
              <p>¿Ya tienes una cuenta?</p>
              <Link to="/login" className="login-link">
                Iniciar Sesión
              </Link>
              <br />
              <br />
              <Link to="/">Volver a la página principal</Link>
            </div>
          </div>

          {/* Sección del formulario */}
          <div className="form-section">
            <h2>Registro</h2>
            <form onSubmit={handleSubmit} className="register-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">Nombre</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    required
                    placeholder="Ej: Juan"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Apellido</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    required
                    placeholder="Ej: Pérez"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="secondLastName">Segundo apellido (opcional)</label>
                <input
                  type="text"
                  id="secondLastName"
                  name="secondLastName"
                  placeholder="Ej: Gómez"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="username">Nombre de usuario (opcional)</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Tu nombre de usuario"
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  placeholder="ejemplo@correo.com"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="password">Contraseña</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    placeholder="Mínimo 8 caracteres"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirmar contraseña</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Repite la contraseña"
                  />
                </div>
              </div>

              <div className="form-group full-width">
                <label htmlFor="phone">Teléfono (opcional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Ej: +59171234567"
                />
              </div>

              <button type="submit" className="register-btn" disabled={loading}>
                {loading ? "Registrando..." : "Crear cuenta"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
