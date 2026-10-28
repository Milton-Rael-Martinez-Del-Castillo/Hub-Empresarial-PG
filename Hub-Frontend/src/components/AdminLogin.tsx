import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import hubApi, { saveAdminSession, isAdminLoggedIn } from '../api/hubApi';

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [esError, setEsError] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje('');
    setCargando(true);

    try {
      const res = await hubApi.post('/hub/login', { email, password });
      saveAdminSession(res.data.user, res.data.token);
      navigate('/admin');
    } catch (err) {
      setEsError(true);
      const msg = axiosErrorMessage(err);
      setMensaje(msg ?? 'Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

  const axiosErrorMessage = (err: unknown) => {
    if (err && typeof err === 'object' && 'response' in err) {
      const ru = (err as { response?: { data?: { message?: string } } }).response;
      if (ru?.data?.message) return ru.data.message;
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8 flex justify-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full border border-brandRed/30 bg-brandRed/10 px-4 py-2 text-sm font-semibold text-brandRed transition-all hover:bg-brandRed hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Volver al Hub
        </Link>
      </div>

      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
        <div className="w-12 h-1 bg-brandRed mx-auto mb-8"></div>
        <h1 className="text-3xl font-bold text-center text-black mb-2">Acceso Administrador</h1>
        <p className="text-center text-sm text-gray-500 mb-8">Panel de administración del Hub Empresarial</p>

        {mensaje && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm font-semibold ${
              esError
                ? 'bg-red-50 border border-red-200 text-red-600'
                : 'bg-green-50 border border-green-200 text-green-600'
            }`}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-black mb-2">Correo</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brandBlue/20 focus:border-brandBlue outline-none transition-all"
              placeholder="admin@univalle.edu"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brandBlue/20 focus:border-brandBlue outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-brandRed hover:bg-[#6e0036] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg disabled:opacity-60"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        {isAdminLoggedIn() && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Ya tienes una sesión activa.{' '}
            <Link to="/admin" className="text-brandRed font-semibold hover:underline">
              Ir al panel
            </Link>
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminLogin;