import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import hubApi from './api/hubApi';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import ProtectedAdmin from './components/ProtectedAdmin';

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navLinks = [
    { path: 'http://localhost:8081', label: 'Incuvalab', external: true },
    { path: '/uma', label: 'UMA', external: false },
    { path: '/nae', label: 'NAE', external: false },
    { path: 'http://localhost:8082', label: 'Crowdfunding', external: true },
    { path: '/admin', label: 'Admin', external: false },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header className="bg-[#880043] border-b-4 border-white/20 shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="text-2xl font-black tracking-tight mb-4 md:mb-0 hover:text-[#66B5CB] transition-colors text-white">
            Hub Empresarial
          </Link>
          <nav className="flex flex-wrap items-center gap-6">
            {location.pathname !== '/' && !location.pathname.startsWith('/admin') && (
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-[#880043]"
              >
                <span aria-hidden="true">←</span>
                Volver al Hub
              </Link>
            )}
            {navLinks.map((link) => (
              link.external ? (
                <a
                  key={link.path}
                  href={link.path}
                  className="text-sm font-black uppercase tracking-widest transition-all hover:text-[#66B5CB] text-white/80 hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`text-sm font-black uppercase tracking-widest transition-all hover:text-[#66B5CB] text-white/80 hover:text-white ${
                    location.pathname === link.path ? 'border-b-2 border-white' : ''
                  }`}
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>
        </div>
      </header>
      <main className="flex-grow container mx-auto px-6 py-10">
        {children}
      </main>
      <footer className="bg-white text-black py-8 border-t border-gray-200">
        <div className="container mx-auto px-6 text-center">
          <p className="font-bold mb-2 tracking-wide uppercase text-sm">Univalle - Hub Empresarial</p>
          <p className="text-xs">© {new Date().getFullYear()} Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function Home() {
  return (
    <div className="space-y-24 pb-12">
      {/* Hero Section Impactante con fondo #880043 */}
      <section className="relative overflow-hidden py-24 mt-4 rounded-[3rem] bg-[#880043] text-white shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-white/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-brandBlue/30 rounded-full blur-[120px] animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 text-center max-w-5xl mx-auto px-6">
          <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 text-white text-xs font-black tracking-widest mb-8 backdrop-blur-md border border-white/20">
            HUB DE INNOVACIÓN UNIVALLE
          </span>
          <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9]">
            Impulsa tu <br/>
            <span className="text-white opacity-90">visión al futuro</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-100 mb-12 leading-relaxed max-w-2xl mx-auto font-light">
            Conectamos el talento académico con el ecosistema empresarial. Transforma tus ideas en realidades de alto impacto.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <button className="px-10 py-5 bg-white text-[#880043] font-black rounded-2xl hover:bg-gray-100 hover:scale-105 transition-all shadow-xl">
              Lanzar Proyecto
            </button>
            <button className="px-10 py-5 bg-white/10 text-white font-black rounded-2xl backdrop-blur-xl border border-white/20 hover:bg-white/20 transition-all">
              Explorar Módulos
            </button>
          </div>
        </div>
      </section>

      {/* Tarjetas Interactivas de Navegación */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: 'Incuvalab', desc: 'Aceleración de startups con mentores de la industria.', icon: '', path: 'http://localhost:8081', external: true },
            { title: 'UMA', desc: 'Laboratorio de desarrollo tecnológico y software de punta.', icon: '', path: '/uma', external: false },
            { title: 'NAE', desc: 'Consultoría estratégica para empresas en crecimiento.', icon: '', path: '/nae', external: false },
            { title: 'Crowdfunding', desc: 'Plataforma para financiar tus sueños colectivamente.', icon: '', path: 'http://localhost:8082', external: true },
          ].map((item) => {
            const cardContent = (
              <>
                <div className="absolute -right-4 -top-4 text-9xl opacity-[0.03] group-hover:opacity-[0.08] transition-opacity pointer-events-none">
                  {item.icon}
                </div>
                <div className="text-5xl mb-8 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 inline-block">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-black mb-4 uppercase tracking-tight group-hover:text-[#880043] transition-colors">{item.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed mb-6">{item.desc}</p>
                <div className="w-12 h-1 bg-[#880043] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </>
            );
            const className = "group relative p-10 bg-white rounded-[2.5rem] border-2 border-gray-100 hover:border-[#880043] shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 overflow-hidden block";
            
            return item.external ? (
              <a key={item.title} href={item.path} className={className}>
                {cardContent}
              </a>
            ) : (
              <Link key={item.title} to={item.path} className={className}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Sección de Estadísticas con acento en el nuevo color */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          <div><div className="text-5xl font-black text-[#880043]">40+</div><div className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2">Startups</div></div>
          <div><div className="text-5xl font-black text-brandBlue">150+</div><div className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2">Mentores</div></div>
          <div><div className="text-5xl font-black text-[#880043]">1.2M</div><div className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2">Capital</div></div>
          <div><div className="text-5xl font-black text-brandBlue">5k+</div><div className="text-xs font-bold text-gray-400 tracking-widest uppercase mt-2">Impacto</div></div>
        </div>
      </section>
    </div>
  );
}

function Nae() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [estado, setEstado] = useState<{ tipo: 'ok' | 'error'; mensaje: string } | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [casos, setCasos] = useState<Array<{ id: number; titulo: string; descripcion: string; imagen_url: string | null }>>([]);

  useEffect(() => {
    let activo = true;
    hubApi
      .get('/nae/casos')
      .then((res) => {
        const data = res.data?.data;
        if (activo && Array.isArray(data)) setCasos(data);
      })
      .catch(() => {
        if (activo) setCasos([]);
      });
    return () => {
      activo = false;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setEstado(null);

    try {
      await hubApi.post('/nae/solicitudes', { nombre: name, correo: email });
      setEstado({ tipo: 'ok', mensaje: `Gracias ${name}, tu solicitud de asesoría fue enviada correctamente.` });
      setName('');
      setEmail('');
    } catch {
      setEstado({ tipo: 'error', mensaje: 'Hubo un problema al enviar la solicitud. Inténtalo nuevamente.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-black border-l-8 border-brandRed pl-4">NAE</h1>
      <div className="bg-[#66B5CB] rounded-[2rem] shadow-xl p-8 md:p-12 mb-6">
      <p className="text-xl mb-12 text-black italic">Núcleo de Asesoramiento Empresarial: Compromiso con el desarrollo académico y profesional.</p>
      
      {/* Carousel */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-black">Casos de Éxito</h2>
        <div className="flex gap-6 overflow-x-auto pb-6 -mx-2 px-2 snap-x">
          {casos.map((c, i) => (
            <div key={c.id} className="snap-center bg-white border border-gray-100 shadow-sm rounded-2xl min-w-[320px] overflow-hidden hover:shadow-md transition-shadow">
              <div className="w-full h-44 flex items-center justify-center bg-gray-200 overflow-hidden">
                {c.imagen_url ? (
                  <img
                    src={c.imagen_url}
                    alt={c.titulo}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-400 font-medium">Imagen Corporativa {i + 1}</span>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 text-black">{c.titulo}</h3>
                <p className="text-black leading-relaxed text-sm">{c.descripcion}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Form */}
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">Solicitar Asesoría</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {estado && (
            <div
              className={`p-4 rounded-xl text-sm font-semibold ${
                estado.tipo === 'ok'
                  ? 'bg-green-50 border border-green-200 text-green-600'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {estado.mensaje}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Nombre</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brandBlue/20 focus:border-brandBlue outline-none transition-all" 
                placeholder="Ej. Juan Pérez"
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brandBlue/20 focus:border-brandBlue outline-none transition-all" 
                placeholder="juan@correo.com"
                required 
              />
            </div>
          </div>
          <button type="submit" disabled={enviando} className="w-full bg-[#880043] hover:bg-[#6e0036] text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg disabled:opacity-60">
            {enviando ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
}

const Incuvalab = () => (
  <div className="max-w-4xl mx-auto py-10">
    <h1 className="text-4xl font-bold text-black mb-6">Incuvalab</h1>
    <p className="text-lg leading-relaxed text-black">
      Transformamos ideas en empresas rentables. Nuestro programa de incubación ofrece mentoría de primer nivel y acceso a redes de inversión para emprendedores universitarios.
    </p>
  </div>
);

const Uma = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState<{ tipo: 'ok' | 'error'; mensaje: string } | null>(null);
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setEstado(null);

    try {
      await hubApi.post('/uma/solicitudes', { nombre: name, correo: email, mensaje });
      setEstado({ tipo: 'ok', mensaje: `Gracias ${name}, tu solicitud fue enviada correctamente.` });
      setName('');
      setEmail('');
      setMensaje('');
    } catch {
      setEstado({ tipo: 'error', mensaje: 'Hubo un problema al enviar la solicitud. Inténtalo nuevamente.' });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-4xl font-bold text-black mb-6 border-l-8 border-brandBlue pl-4">UMA</h1>
      <div className="bg-[#66B5CB] rounded-[2rem] shadow-xl p-8 md:p-12 mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-black">Unidad de Desarrollos Tecnológicos</h2>
        <p className="text-lg text-black/80 mb-10">Concentramos el talento de ingeniería y sistemas para desarrollar soluciones reales a problemas complejos de la industria.</p>

        {/* Form */}
        <div className="bg-white p-10 rounded-3xl shadow-lg max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-black">Solicitar Desarrollos</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {estado && (
            <div
              className={`p-4 rounded-xl text-sm font-semibold ${
                estado.tipo === 'ok'
                  ? 'bg-green-50 border border-green-200 text-green-600'
                  : 'bg-red-50 border border-red-200 text-red-600'
              }`}
            >
              {estado.mensaje}
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-black mb-2">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brandBlue/20 focus:border-brandBlue outline-none transition-all"
                placeholder="Ej. María López"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-black mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brandBlue/20 focus:border-brandBlue outline-none transition-all"
                placeholder="maria@correo.com"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-2">Mensaje</label>
            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              rows={4}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-brandBlue/20 focus:border-brandBlue outline-none transition-all resize-y"
              placeholder="Cuéntanos qué solución necesitas..."
            />
          </div>
          <button type="submit" disabled={enviando} className="w-full bg-[#66B5CB] hover:bg-[#4a9db5] text-black font-bold py-4 px-6 rounded-xl transition-all shadow-lg disabled:opacity-60">
            {enviando ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

const Crowdfunding = () => (
  <div className="max-w-4xl mx-auto text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
    <h1 className="text-4xl font-bold text-black mb-4">Crowdfunding</h1>
    <div className="w-20 h-1 bg-brandBlue mx-auto mb-6"></div>
    <p className="text-xl text-black italic">Módulo de financiamiento colectivo en proceso de integración...</p>
  </div>
);

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/incuvalab" element={<Incuvalab />} />
          <Route path="/uma" element={<Uma />} />
          <Route path="/nae" element={<Nae />} />
          <Route path="/crowdfunding" element={<Crowdfunding />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedAdmin>
                <AdminDashboard />
              </ProtectedAdmin>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}
