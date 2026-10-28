// src/components/pages/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Ruta corregida
import LoginLogo from "../login/LoginLogo";
import LoginLinks from "../login/LoginLinks";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al iniciar sesión');
      }

      login(data.token, data.user);
      
      if (data.user?.rol === 'Administrador') {
        navigate('/admin-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    navigate('/');
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <LoginLogo />
      <h1 className="text-xl text-center my-4">Inicia sesión con tu correo electrónico</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded"
          required
        />
        
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          required
        />
        
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 rounded text-white ${isLoading ? 'bg-gray-400' : 'bg-[#8B0D37] hover:bg-[#6d0a2b]'}`}
        >
          {isLoading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
      </form>

      <div className="my-4 flex items-center">
        <div className="flex-grow border-t"></div>
        <span className="mx-2">o</span>
        <div className="flex-grow border-t"></div>
      </div>

      <button
        onClick={handleGuestAccess}
        className={`w-full p-2 rounded font-medium transition-colors duration-200 ${
          isLoading ? 'bg-[#8d8d8d] text-white' : 'bg-[#8B0D37] hover:bg-[#6d0a2b] text-white'
        }`}
      >
        Continuar como invitado
      </button>

      <LoginLinks />
    </div>
  );
};

export default LoginForm;