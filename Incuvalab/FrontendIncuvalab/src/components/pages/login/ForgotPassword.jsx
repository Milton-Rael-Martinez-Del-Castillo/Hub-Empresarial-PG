import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLogo from "./LoginLogo";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Verificar email, 2: Nueva contraseña
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("http://localhost:8000/api/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error al verificar el correo");
      }
      
      setStep(2);
      setSuccess(data.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    
    if (newPassword.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          email,
          newPassword 
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar la contraseña");
      }
      
      setSuccess("Contraseña actualizada exitosamente. Redirigiendo al login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <LoginLogo />
          <h1 className="text-gray-700 text-xl mb-6 text-center">
            {step === 1 ? "Recuperar contraseña" : "Establecer nueva contraseña"}
          </h1>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleVerifyEmail} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-4">
                  Ingresa tu correo electrónico para verificar tu cuenta y restablecer tu contraseña.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#8B0D37] text-white py-2 px-4 rounded hover:bg-[#6d0a2b] transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Verificando..." : "Verificar correo"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="relative">
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nueva contraseña"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37] pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres, incluyendo mayúsculas, minúsculas y números.
                </p>
              </div>

              <div className="relative">
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar nueva contraseña"
                    className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37] pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-[#8B0D37] text-white py-2 px-4 rounded hover:bg-[#6d0a2b] transition-colors ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Actualizando..." : "Actualizar contraseña"}
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-[#8B0D37] hover:text-[#6d0a2b] font-medium"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex w-1/2 items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/UNIVALLE.png')" }}
      ></div>
    </div>
  );
}

export default ForgotPassword;