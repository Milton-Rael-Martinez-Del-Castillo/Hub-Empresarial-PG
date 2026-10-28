import React from "react";
import { useNavigate } from "react-router-dom";
import LoginLogo from "../login/LoginLogo";

function Help() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Vuelve a la página anterior
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <LoginLogo />
          <h1 className="text-gray-700 text-xl mb-6 text-center font-bold">
            Información sobre el registro e inicio de sesión
          </h1>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-4">
            <h2 className="text-lg font-semibold text-[#8B0D37] mb-3">Registro de Usuario</h2>
            <p className="text-sm text-gray-600 mb-4">
              Para registrarte en nuestra plataforma, necesitas:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1">
              <li>Una dirección de correo electrónico válida</li>
              <li>Una contraseña segura que cumpla con los requisitos</li>
              <li>Seleccionar tu rol (Administrador, Emprendedor, Mentor, etc.)</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#8B0D37] mb-3">Requisitos de Contraseña</h2>
            <p className="text-sm text-gray-600 mb-2">
              Tu contraseña debe contener:
            </p>
            <ul className="list-disc pl-5 text-sm text-gray-600 mb-4 space-y-1">
              <li>Mínimo 8 caracteres</li>
              <li>Al menos una letra mayúscula</li>
              <li>Al menos una letra minúscula</li>
              <li>Al menos un número</li>
              <li>Al menos un carácter especial (!@#$%^&*)</li>
            </ul>

            <h2 className="text-lg font-semibold text-[#8B0D37] mb-3">Inicio de Sesión</h2>
            <p className="text-sm text-gray-600 mb-4">
              Para iniciar sesión, ingresa el correo electrónico y contraseña con los que te registraste. 
              Si olvidaste tu contraseña, haz clic en "¿Olvidaste tu contraseña?".
            </p>

            <h2 className="text-lg font-semibold text-[#8B0D37] mb-3">Acceso como Invitado</h2>
            <p className="text-sm text-gray-600">
              Puedes acceder como invitado con funcionalidades limitadas sin necesidad de registro.
            </p>
          </div>

          <div className="flex flex-col space-y-4">
            
            <button
              onClick={() => navigate("/login")}
              className="w-full text-[#8B0D37] hover:text-[#6d0a2b] font-medium py-2 px-4"
            >
              Ir al inicio de sesión
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Necesitas más ayuda?{" "}
              <a 
                href="mailto:soporte@univalle.edu" 
                className="text-[#8B0D37] hover:underline font-medium"
              >
                Contactar soporte
              </a>
            </p>
          </div>
        </div>
      </div>

      <div
        className="hidden md:flex w-1/2 items-center justify-center bg-cover bg-center bg-gray-100"
        style={{ backgroundImage: "url('/UNIVALLE3.jpg')" }}
      ></div>
    </div>
  );
}

export default Help;