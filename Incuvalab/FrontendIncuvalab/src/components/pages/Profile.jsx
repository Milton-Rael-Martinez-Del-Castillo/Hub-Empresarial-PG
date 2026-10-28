import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Get basic user data from localStorage
        const userData = localStorage.getItem('user');
        if (!userData) {
          navigate('/login');
          return;
        }

        const parsedUser = JSON.parse(userData);
        
        // Here you could make an API call to get more detailed user information
        // Example:
        // const response = await axios.get(`/api/users/${parsedUser.id}`, {
        //   headers: {
        //     Authorization: `Bearer ${token}`
        //   }
        // });
        // setUser(response.data);

        // For now, we'll just use the basic data
        setUser(parsedUser);
        
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Error al cargar los datos del usuario');
        if (err.response?.status === 401) {
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-[#8B0D37]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="h-12 w-12 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="mt-4 text-lg font-medium text-gray-700">{error}</p>
          <button
            onClick={() => navigate('/login')}
            className="mt-4 px-4 py-2 bg-[#8B0D37] text-white rounded-md hover:bg-[#6E0B2A] transition-colors"
          >
            Volver a login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-[#8B0D37]">
            <div className="flex items-center">
              <div className="flex-shrink-0 h-16 w-16 rounded-full bg-white flex items-center justify-center text-[#8B0D37] text-2xl font-bold">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
              <div className="ml-4">
                <h3 className="text-lg leading-6 font-medium text-white">Perfil de Usuario</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-200">{user?.email}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Correo electrónico</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user?.email}</dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Rol</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">{user?.rol}</dd>
              </div>
              {/* Add more user details here as needed */}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Miembro desde</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {/* You would typically get this from your user data */}
                  {new Date().toLocaleDateString()}
                </dd>
              </div>
            </dl>
          </div>
          <div className="px-4 py-4 bg-gray-50 text-right sm:px-6">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#8B0D37] hover:bg-[#6E0B2A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#8B0D37]"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;