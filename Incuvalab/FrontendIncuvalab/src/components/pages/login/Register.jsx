import React, { useState } from "react";
import LoginLogo from "../login/LoginLogo";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    rol: "Administrador"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordStrength, setPasswordStrength] = useState({
    valid: false,
    message: "",
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      specialChar: false
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (name === "password") {
      validatePasswordStrength(value);
    }
  };

  const validatePasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const valid = Object.values(requirements).every(Boolean);
    
    let message = "";
    if (!valid) {
      const missing = [];
      if (!requirements.length) missing.push("mínimo 8 caracteres");
      if (!requirements.uppercase) missing.push("una mayúscula");
      if (!requirements.lowercase) missing.push("una minúscula");
      if (!requirements.number) missing.push("un número");
      if (!requirements.specialChar) missing.push("un carácter especial");
      
      message = `La contraseña debe contener: ${missing.join(", ")}`;
    } else {
      message = "Contraseña segura";
    }

    setPasswordStrength({
      valid,
      message,
      requirements
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setIsLoading(false);
      return;
    }

    if (!passwordStrength.valid) {
      setError(passwordStrength.message);
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Por favor ingresa un correo electrónico válido.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          rol: formData.rol
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Usuario registrado correctamente");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setError(result.message || "Error al registrar. Intenta nuevamente.");
      }
    } catch (err) {
      setError("Error al registrar. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    const met = Object.values(passwordStrength.requirements).filter(Boolean).length;
    const total = Object.keys(passwordStrength.requirements).length;
    const percentage = (met / total) * 100;

    if (percentage < 40) return "bg-red-500";
    if (percentage < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthWidth = () => {
    const met = Object.values(passwordStrength.requirements).filter(Boolean).length;
    const total = Object.keys(passwordStrength.requirements).length;
    return `${(met / total) * 100}%`;
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-full md:w-1/2 flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <LoginLogo />
          <h1 className="text-gray-700 text-xl mb-6 text-center">
            Crea una cuenta con tu correo electrónico
          </h1>

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@correo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                required
              />
            </div>

            <div className="relative">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Crea una contraseña"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37] pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {showPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                </button>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className={`h-2 rounded-full ${getStrengthColor()}`}
                  style={{ width: getStrengthWidth() }}
                ></div>
              </div>
              
              {formData.password && (
                <p className={`text-xs mt-1 ${
                  passwordStrength.valid ? "text-green-600" : "text-red-600"
                }`}>
                  {passwordStrength.message}
                </p>
              )}
              
              <ul className="text-xs text-gray-600 mt-2">
                <li className={passwordStrength.requirements.length ? "text-green-500" : ""}>
                  ✓ Mínimo 8 caracteres
                </li>
                <li className={passwordStrength.requirements.uppercase ? "text-green-500" : ""}>
                  ✓ Al menos una mayúscula
                </li>
                <li className={passwordStrength.requirements.lowercase ? "text-green-500" : ""}>
                  ✓ Al menos una minúscula
                </li>
                <li className={passwordStrength.requirements.number ? "text-green-500" : ""}>
                  ✓ Al menos un número
                </li>
                <li className={passwordStrength.requirements.specialChar ? "text-green-500" : ""}>
                  ✓ Al menos un carácter especial (!@#$%^&*)
                </li>
              </ul>
            </div>

            <div className="relative">
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirma tu contraseña"
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37] pr-10"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Ocultar confirmación" : "Mostrar confirmación"}
                >
                  {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="text-xs text-red-600 mt-1">Las contraseñas no coinciden</p>
              )}
            </div>

            <div>
              <select
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                required
              >
                <option value="Administrador">Administrador</option>
                <option value="Emprendedor">Emprendedor</option>
                <option value="Mentor">Mentor</option>
                <option value="Institución">Institución</option>
                <option value="Estudiante">Estudiante</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading || !passwordStrength.valid}
              className={`w-full bg-[#8B0D37] text-white py-2 px-4 rounded hover:bg-[#6d0a2b] transition-colors ${
                isLoading || !passwordStrength.valid ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Registrando..." : "Registrarse"}
            </button>
          </form>

          <p className="text-sm text-blue-600 text-center space-x-2 mt-8">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>

      <div
        className="hidden md:flex w-1/2 items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/registro-bg.jpg')" }}
      >
      </div>
    </div>
  );
}

export default RegisterForm;