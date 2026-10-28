// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './login/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return null; // o un spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.rol !== 'Administrador') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;