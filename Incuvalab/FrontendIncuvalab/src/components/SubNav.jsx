import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userDropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Get user from localStorage
  const [user, setUser] = useState(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  const menuItems = [
    { name: 'Acerca de nosotros', path: '/quienes-somos' },
    { name: 'Nuestros servicios', path: '/servicios', isDropdown: true },
    { name: 'Crowd Funding', path: '/crowdfunding' },
    { name: 'Mentores', path: '/mentoring' },
    { name: 'Eventos', path: '/eventos' }
  ];

  const dropdownItems = [
    { name: 'Inspiring', path: '/servicios/inspiring' },
    { name: 'Challengers', path: '/servicios/challengers' },
    { name: 'Revenue', path: '/servicios/revenue' },
    { name: 'Partners', path: '/servicios/partners' },
    { name: 'Learning', path: '/servicios/moocs' }
  ];

  useEffect(() => {
    const currentPath = location.pathname;
    const activeIndex = menuItems.findIndex(item => currentPath.startsWith(item.path));
    setActiveItem(activeIndex >= 0 ? activeIndex : null);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setIsUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleArrowClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(prev => !prev);
  };

  const handleUserDropdownClick = (e) => {
    e.preventDefault();
    setIsUserDropdownOpen(prev => !prev);
  };

  const handleOptionClick = () => {
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
      setIsUserDropdownOpen(false);
      navigate('/login');
      window.location.reload();
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  const renderDropdown = () => (
    <div
      className={`absolute top-full left-0 w-56 bg-white shadow-lg rounded-md mt-2 z-50 transform transition-all duration-300 ease-in-out ${isDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
    >
      {dropdownItems.map((dropdownItem, dropdownIndex) => (
        <Link
          key={dropdownIndex}
          to={dropdownItem.path}
          className={`block px-4 py-2 text-sm text-gray-700 hover:text-[#8B0D37] hover:bg-gray-100 ${location.pathname === dropdownItem.path ? 'text-[#8B0D37]' : ''
            }`}
          onClick={handleOptionClick}
        >
          {dropdownItem.name}
        </Link>
      ))}
    </div>
  );

  const renderUserDropdown = () => (
    <div
      className={`absolute top-full right-0 w-48 bg-white shadow-lg rounded-md mt-2 z-50 transform transition-all duration-300 ease-in-out ${isUserDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
        <p className="text-xs text-gray-500 capitalize">{user?.rol}</p>
      </div>
      <Link
        to="/perfil"
        className="block px-4 py-2 text-sm text-gray-700 hover:text-[#8B0D37] hover:bg-gray-100"
        onClick={() => setIsUserDropdownOpen(false)}
      >
        Mi perfil
      </Link>
      {user?.rol === 'Mentor' && (
        <>
          <Link
            to="/course-builder"
            className="block px-4 py-2 text-sm text-[#8B0D37] hover:bg-gray-100 font-semibold"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            Crear curso
          </Link>
          <Link
            to="/mis-cursos"
            className="block px-4 py-2 text-sm text-[#8B0D37] hover:bg-gray-100 font-semibold"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            Mis cursos
          </Link>
          <Link
            to="/mis-mentees"
            className="block px-4 py-2 text-sm text-[#8B0D37] hover:bg-gray-100 font-semibold"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            Mis Mentees
          </Link>
        </>
      )}
      {user?.rol === 'Emprendedor' && (
        <Link
          to="/mis-tareas"
          className="block px-4 py-2 text-sm text-[#8B0D37] hover:bg-gray-100 font-semibold"
          onClick={() => setIsUserDropdownOpen(false)}
        >
          Mis Tareas
        </Link>
      )}
      <button
        onClick={handleLogout}
        disabled={loading}
        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:text-[#8B0D37] hover:bg-gray-100 flex items-center"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cerrando...
          </>
        ) : 'Cerrar sesión'}
      </button>
    </div>
  );

  return (
    <div className="w-full bg-white border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 md:px-12">
        <Link to="/" className="flex items-center h-20">
          <img
            src="/logo-incuvalab.png"
            alt="Incuva Lab"
            className="h-full w-auto object-contain"
          />
        </Link>

        <nav className="flex items-center h-20 relative gap-2">
          {menuItems.map((item, index) => (
            item.isDropdown ? (
              <div key={index} className="relative flex items-center gap-1 md:gap-1.5" ref={dropdownRef}>
                <Link
                  to={item.path}
                  className="px-3 h-20 flex items-center text-sm md:text-base font-medium relative"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span
                    className={`relative after:content-[''] after:block after:h-0.5 after:bg-[#8B0D37] after:transition-all after:duration-300 after:mx-auto
                      ${activeItem === index
                        ? 'text-[#8B0D37] after:w-full'
                        : 'text-gray-700 hover:text-[#8B0D37] after:w-0 hover:after:w-full'}`}
                  >
                    {item.name}
                  </span>
                </Link>
                <button
                  onClick={handleArrowClick}
                  className="h-20 flex items-center px-1 text-gray-700 hover:text-[#8B0D37]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {renderDropdown()}
              </div>
            ) : (
              <Link
                key={index}
                to={item.path}
                className="px-3 h-20 flex items-center mx-1 md:mx-3 text-sm md:text-base font-medium relative"
                onClick={() => setIsDropdownOpen(false)}
              >
                <span
                  className={`relative after:content-[''] after:block after:h-0.5 after:bg-[#8B0D37] after:transition-all after:duration-300 after:mx-auto
                    ${activeItem === index
                      ? 'text-[#8B0D37] after:w-full'
                      : 'text-gray-700 hover:text-[#8B0D37] after:w-0 hover:after:w-full'}`}
                >
                  {item.name}
                </span>
              </Link>
            )
          ))}

          <a
            href="http://localhost:8080"
            className="ml-2 md:ml-4 px-4 py-2 border-2 border-[#8B0D37] text-[#8B0D37] rounded-md font-medium hover:bg-[#8B0D37] hover:text-white transition-colors duration-200 flex items-center whitespace-nowrap"
          >
            <span aria-hidden="true" className="mr-2">←</span>
            Volver al Hub
          </a>

          {user ? (
            <div className="relative ml-2 md:ml-4" ref={userDropdownRef}>
              <button
                onClick={handleUserDropdownClick}
                className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="w-8 h-8 rounded-full bg-[#8B0D37] flex items-center justify-center text-white font-medium">
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {renderUserDropdown()}
            </div>
          ) : (
            <Link
              to="/login"
              className="group ml-2 md:ml-4 px-4 py-2 bg-[#8B0D37] text-white rounded-md font-medium hover:bg-[#6E0B2A] transition-colors duration-200 flex items-center"
              onClick={() => setIsDropdownOpen(false)}
            >
              <span>Login</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          )}
        </nav>
      </div>
    </div>
  );
};

export default SubNav;