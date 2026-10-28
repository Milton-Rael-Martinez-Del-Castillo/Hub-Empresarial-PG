// src/assets/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // No logueado → al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un rol específico y el usuario no lo cumple → a la página principal
  if (role && user.Id_Rol !== role) {
    return <Navigate to="/" replace />;
  }

  // Si pasa validaciones → renderiza el componente hijo
  return children;
};

export default PrivateRoute;
