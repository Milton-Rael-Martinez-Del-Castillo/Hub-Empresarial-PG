import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8083/api';

const hubApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: adjuntar token JWT de administrador en cada peticion
hubApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('hub_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Guardar sesion de administrador
export const saveAdminSession = (user: unknown, token: string) => {
  localStorage.setItem('hub_token', token);
  localStorage.setItem('hub_user', JSON.stringify(user));
};

// Cerrar sesion de administrador
export const clearAdminSession = () => {
  localStorage.removeItem('hub_token');
  localStorage.removeItem('hub_user');
};

export const getAdminUser = () => {
  const raw = localStorage.getItem('hub_user');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const isAdminLoggedIn = () => Boolean(localStorage.getItem('hub_token'));

export default hubApi;