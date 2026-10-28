import React, { useState } from "react";

const ForgotPasswordPopup = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Paso 1: enviar token al correo
  const handleSendToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/usuarios/send-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar token");

      setMessage("✅ Token enviado a tu correo");
      setStep(2); // pasar al siguiente paso
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Paso 2: validar token
  const handleValidateToken = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/validate-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Token inválido");

      setMessage("Token válido. Ingresa tu nueva contraseña");
      setStep(3); // mostrar input de nueva contraseña
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Paso 3: actualizar contraseña
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Validar que ambas contraseñas coincidan
    if (newPassword !== confirmPassword) {
      setMessage("❌ Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, token, newPassword }),
        }
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Error actualizando contraseña");

      setMessage("Contraseña actualizada exitosamente");
      setStep(4); // paso final de éxito
    } catch (err) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Recuperar contraseña</h2>

        {step === 1 && (
          <form onSubmit={handleSendToken}>
            <label>Correo registrado:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar código"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleValidateToken}>
            <label>Token recibido:</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Ingresa el token"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Validando..." : "Validar token"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <label>Nueva contraseña:</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Nueva contraseña"
              required
            />

            <label>Repite la nueva contraseña:</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirma la nueva contraseña"
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>
        )}

        {step === 4 && <p>{message}</p>}

        {/* Botón cerrar siempre visible */}
        <button className="close-btn" onClick={onClose}>
          Cerrar
        </button>

        {/* Mensajes de paso intermedio */}
        {step !== 4 && message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPasswordPopup;
