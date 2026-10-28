// src/components/pages/Login.jsx
import React from "react";
import LoginBackground from "../login/LoginBackground"; // Asegúrate de que coincida con la estructura real
import LoginForm from "../login/LoginForm"; 
import Registrer from "../login/Register";

function Login() {
  // Podríamos ocultar Navbar, SubNav y Footer para esta página
  React.useEffect(() => {
    // Ocultar elementos de navegación solo en la página de login
    document.body.classList.add('login-page');
    
    return () => {
      // Restaurar al salir del componente
      document.body.classList.remove('login-page');
    };
  }, []);

  return (
    <div className="flex min-h-screen relative">
      <a
        href="http://localhost:8080"
        className="absolute top-6 left-6 z-10 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition-all hover:bg-white hover:text-[#8B0D37] shadow-sm"
      >
        <span aria-hidden="true">←</span>
        Volver al Hub
      </a>

      {/* Lado izquierdo - Imagen de fondo */}
      <LoginBackground />
      
      {/* Lado derecho - Formulario de login */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <LoginForm />
      </div>
    </div>
  );
}

export default Login;