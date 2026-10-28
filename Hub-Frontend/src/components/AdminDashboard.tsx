import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import hubApi, { clearAdminSession, getAdminUser } from '../api/hubApi';

type Solicitud = {
  id: number;
  nombre: string;
  correo: string;
  mensaje?: string | null;
  created_at?: string;
};

type Mentor = {
  id: number;
  image_url: string | null;
  nombre: string;
  telefono: string;
  area_experiencia: string;
  disponibilidad: string;
};

type Proyecto = {
  IdProyecto: number;
  Titulo: string;
  Categoria: string;
  DescripcionCorta: string;
  ImagenPrincipal: string | null;
  EstadoAprobacion: string;
  NombreCreador: string;
  ApellidoCreador: string;
};

type Caso = {
  id: number;
  titulo: string;
  descripcion: string;
  imagen_url: string | null;
  orden: number;
};

type Tab = 'nae' | 'uma' | 'mentores' | 'proyectos' | 'casos';

const TAB_STYLES: Record<Tab, { active: string }> = {
  nae: { active: 'bg-[#880043] text-white shadow-lg' },
  uma: { active: 'bg-[#66B5CB] text-white shadow-lg' },
  mentores: { active: 'bg-[#880043] text-white shadow-lg' },
  proyectos: { active: 'bg-[#66B5CB] text-white shadow-lg' },
  casos: { active: 'bg-[#880043] text-white shadow-lg' }
};

function aplanar(respuesta: { data: unknown }): unknown[] {
  const data = respuesta.data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object' && Array.isArray((data as { data?: unknown }).data)) {
    return (data as { data: unknown[] }).data;
  }
  return [];
}

function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getAdminUser() as { email?: string; rol?: string } | null;

  // pestaña activa (query string o default nae)
  const params = new URLSearchParams(location.search);
  const initialTab: Tab =
    params.get('tab') === 'uma'
      ? 'uma'
      : params.get('tab') === 'mentores'
        ? 'mentores'
        : params.get('tab') === 'proyectos'
          ? 'proyectos'
          : params.get('tab') === 'casos'
            ? 'casos'
            : 'nae';
  const [tab, setTab] = useState<Tab>(initialTab);
  const [nae, setNae] = useState<Solicitud[]>([]);
  const [uma, setUma] = useState<Solicitud[]>([]);
  const [mentores, setMentores] = useState<Mentor[]>([]);
  const [proyectos, setProyectos] = useState<Proyecto[]>([]);
  const [casos, setCasos] = useState<Caso[]>([]);
  const [mensaje, setMensaje] = useState('');
  const [mensajeCasos, setMensajeCasos] = useState<{ tipo: 'ok' | 'error'; texto: string } | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [formCaso, setFormCaso] = useState({ titulo: '', descripcion: '', imagen_url: '', orden: 0 });

  const sesionVencida = (err: unknown) => {
    if (!isUnauthorized(err)) return false;
    clearAdminSession();
    navigate('/admin/login');
    return true;
  };

  const cargarExternos = useCallback(async () => {
    try {
      const [m, p] = await Promise.all([
        hubApi.get('/hub/mentores'),
        hubApi.get('/hub/proyectos-crowdfunding')
      ]);
      setMentores(aplanar(m) as Mentor[]);
      setProyectos(aplanar(p) as Proyecto[]);
    } catch (err) {
      if (!sesionVencida(err)) {
        setMensaje('No se pudo cargar las vistas de Incuvalab/Crowdfunding');
      }
    }
  }, [navigate]);

  const cargar = useCallback(async () => {
    setCargando(true);
    setMensaje('');
    try {
      const [naeRes, umaRes] = await Promise.all([
        hubApi.get('/nae/solicitudes'),
        hubApi.get('/uma/solicitudes')
      ]);
      setNae(aplanar(naeRes) as Solicitud[]);
      setUma(aplanar(umaRes) as Solicitud[]);
    } catch (err) {
      if (!sesionVencida(err)) {
        setMensaje('Error al cargar las solicitudes');
      }
    } finally {
      setCargando(false);
    }
  }, [navigate]);

  const cargarCasos = useCallback(async () => {
    try {
      const res = await hubApi.get('/nae/casos');
      setCasos(aplanar(res) as Caso[]);
    } catch (err) {
      if (!sesionVencida(err)) {
        setMensaje('No se pudieron cargar los casos de éxito NAE');
      }
    }
  }, [navigate]);

  useEffect(() => {
    cargar();
    cargarExternos();
    cargarCasos();
  }, [cargar, cargarExternos, cargarCasos]);

  const cambiarTab = (nueva: Tab) => {
    setTab(nueva);
    navigate(`/admin?tab=${nueva}`, { replace: true });
  };

  const eliminar = async (tipo: 'nae' | 'uma', id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar esta solicitud?')) return;
    try {
      await hubApi.delete(`/${tipo}/solicitudes/${id}`);
      setMensaje('Solicitud eliminada correctamente');
      if (tipo === 'nae') setNae((prev) => prev.filter((s) => s.id !== id));
      else setUma((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      if (!sesionVencida(err)) {
        setMensaje('Error al eliminar la solicitud');
      }
    }
  };

  const logout = () => {
    clearAdminSession();
    navigate('/admin/login');
  };

  const abrirNuevoCaso = () => {
    setMensajeCasos(null);
    setEditandoId(null);
    setFormCaso({ titulo: '', descripcion: '', imagen_url: '', orden: casos.length + 1 });
    setMostrarForm(true);
  };

  const abrirEdicionCaso = (c: Caso) => {
    setMensajeCasos(null);
    setEditandoId(c.id);
    setFormCaso({ titulo: c.titulo, descripcion: c.descripcion, imagen_url: c.imagen_url || '', orden: c.orden });
    setMostrarForm(true);
  };

  const guardarCaso = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      titulo: formCaso.titulo,
      descripcion: formCaso.descripcion,
      imagen_url: formCaso.imagen_url,
      orden: Number(formCaso.orden) || 0
    };
    try {
      if (editandoId !== null) {
        await hubApi.put(`/nae/casos/${editandoId}`, payload);
        setMensajeCasos({ tipo: 'ok', texto: 'Caso actualizado correctamente' });
      } else {
        await hubApi.post('/nae/casos', payload);
        setMensajeCasos({ tipo: 'ok', texto: 'Caso creado correctamente' });
      }
      setMostrarForm(false);
      setEditandoId(null);
      setFormCaso({ titulo: '', descripcion: '', imagen_url: '', orden: 0 });
      await cargarCasos();
    } catch (err) {
      if (!sesionVencida(err)) {
        setMensajeCasos({ tipo: 'error', texto: 'Error al guardar el caso' });
      }
    }
  };

  const eliminarCaso = async (id: number) => {
    if (!window.confirm('¿Estás seguro de eliminar este caso?')) return;
    try {
      await hubApi.delete(`/nae/casos/${id}`);
      setMensajeCasos({ tipo: 'ok', texto: 'Caso eliminado correctamente' });
      await cargarCasos();
    } catch (err) {
      if (!sesionVencida(err)) {
        setMensajeCasos({ tipo: 'error', texto: 'Error al eliminar el caso' });
      }
    }
  };

  const formatFecha = (fecha?: string) => {
    if (!fecha) return '';
    const d = new Date(fecha);
    return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const lista = tab === 'nae' ? nae : tab === 'uma' ? uma : [];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-black mb-2 border-l-8 border-brandRed pl-4">Panel Administrador</h1>
          <p className="text-sm text-gray-500">
            {user?.email ? `Sesión de ${user.email}` : 'Sesión de administrador'}
          </p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full border border-brandRed/30 bg-brandRed/10 px-4 py-2 text-sm font-semibold text-brandRed transition-all hover:bg-brandRed hover:text-white"
          >
            <span aria-hidden="true">←</span>
            Volver al Hub
          </Link>
          <button
            onClick={logout}
            className="inline-flex items-center rounded-full border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-600 transition-all hover:border-red-400 hover:text-red-500"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {mensaje && (
        <div className="mb-6 p-4 rounded-xl text-sm font-semibold bg-red-50 border border-red-200 text-red-600">
          {mensaje}
        </div>
      )}

      {/* Contenido del panel en tarjeta celeste (mismo estilo UMA/NAE) */}
      <div className="bg-[#66B5CB] rounded-[2rem] shadow-xl p-6 md:p-10 mb-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => cambiarTab('nae')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            tab === 'nae' ? TAB_STYLES.nae.active : 'bg-white/60 text-gray-600 hover:bg-white'
          }`}
        >
          Solicitudes NAE
        </button>
        <button
          onClick={() => cambiarTab('uma')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            tab === 'uma' ? TAB_STYLES.uma.active : 'bg-white/60 text-gray-600 hover:bg-white'
          }`}
        >
          Solicitudes UMA
        </button>
        <button
          onClick={() => cambiarTab('casos')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            tab === 'casos' ? TAB_STYLES.casos.active : 'bg-white/60 text-gray-600 hover:bg-white'
          }`}
        >
          Casos de Éxito NAE
        </button>
        <button
          onClick={() => cambiarTab('mentores')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            tab === 'mentores' ? TAB_STYLES.mentores.active : 'bg-white/60 text-gray-600 hover:bg-white'
          }`}
        >
          Mentores (Incuvalab)
        </button>
        <button
          onClick={() => cambiarTab('proyectos')}
          className={`px-6 py-3 rounded-xl font-bold transition-all ${
            tab === 'proyectos' ? TAB_STYLES.proyectos.active : 'bg-white/60 text-gray-600 hover:bg-white'
          }`}
        >
          Proyectos (Crowdfunding)
        </button>
      </div>

      {tab === 'nae' || tab === 'uma' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-lg text-black">
              {tab === 'nae' ? 'Solicitudes de asesoría NAE' : 'Solicitudes de contacto UMA'}
              <span className="ml-2 text-sm text-gray-500">({lista.length})</span>
            </h2>
          </div>

          {cargando ? (
            <p className="p-10 text-center text-gray-500">Cargando solicitudes...</p>
          ) : lista.length === 0 ? (
            <p className="p-10 text-center text-gray-500">Aún no hay solicitudes registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">ID</th>
                    <th className="px-6 py-4 font-bold">Nombre</th>
                    <th className="px-6 py-4 font-bold">Correo</th>
                    {tab === 'uma' && <th className="px-6 py-4 font-bold">Mensaje</th>}
                    <th className="hidden md:table-cell px-6 py-4 font-bold">Fecha</th>
                    <th className="px-6 py-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lista.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-500">{s.id}</td>
                      <td className="px-6 py-4 font-semibold text-black">{s.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{s.correo}</td>
                      {tab === 'uma' && (
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                          {s.mensaje || '—'}
                        </td>
                      )}
                      <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-500">
                        {formatFecha(s.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => eliminar(tab, s.id)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {tab === 'casos' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-lg text-black">
              Casos de Éxito NAE
              <span className="ml-2 text-sm text-gray-500">({casos.length})</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">Estos casos se muestran en el carrusel de la vista NAE.</p>
          </div>

          <div className="p-6 flex flex-wrap items-center gap-3">
            <button
              onClick={abrirNuevoCaso}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-[#880043] hover:bg-[#6e0036] transition-colors"
            >
              + Nuevo caso
            </button>
            {mensajeCasos && (
              <span
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold ${
                  mensajeCasos.tipo === 'ok'
                    ? 'bg-[#66B5CB]/20 text-[#4a9db5] border border-[#66B5CB]/40'
                    : 'bg-red-50 text-red-600 border border-red-200'
                }`}
              >
                {mensajeCasos.texto}
              </span>
            )}
          </div>

          {mostrarForm && (
            <form onSubmit={guardarCaso} className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-2">Título</label>
                  <input
                    value={formCaso.titulo}
                    onChange={(e) => setFormCaso({ ...formCaso, titulo: e.target.value })}
                    required
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#66B5CB]/20 focus:border-[#66B5CB] outline-none transition-all"
                    placeholder="Ej. Proyecto Destacado 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-2">URL de imagen (opcional)</label>
                  <input
                    value={formCaso.imagen_url}
                    onChange={(e) => setFormCaso({ ...formCaso, imagen_url: e.target.value })}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#66B5CB]/20 focus:border-[#66B5CB] outline-none transition-all"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Descripción</label>
                <textarea
                  value={formCaso.descripcion}
                  onChange={(e) => setFormCaso({ ...formCaso, descripcion: e.target.value })}
                  required
                  rows={3}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#66B5CB]/20 focus:border-[#66B5CB] outline-none transition-all resize-y"
                  placeholder="Describe el caso de éxito..."
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">Orden (para el carrusel)</label>
                <input
                  type="number"
                  value={formCaso.orden}
                  onChange={(e) => setFormCaso({ ...formCaso, orden: Number(e.target.value) })}
                  className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-4 focus:ring-[#66B5CB]/20 focus:border-[#66B5CB] outline-none transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#880043] hover:bg-[#6e0036] transition-all"
                >
                  {editandoId !== null ? 'Guardar cambios' : 'Crear caso'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMostrarForm(false);
                    setEditandoId(null);
                  }}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-200 hover:bg-gray-300 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {casos.length === 0 ? (
            <p className="p-10 text-center text-gray-500">Aún no hay casos de éxito registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Imagen</th>
                    <th className="px-6 py-4 font-bold">Título</th>
                    <th className="px-6 py-4 font-bold">Descripción</th>
                    <th className="px-6 py-4 font-bold">Orden</th>
                    <th className="px-6 py-4 font-bold text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {casos.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        {c.imagen_url ? (
                          <img
                            src={c.imagen_url}
                            alt={c.titulo}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            className="w-14 h-11 rounded-lg object-cover bg-gray-100"
                          />
                        ) : (
                          <span className="inline-flex w-14 h-11 items-center justify-center rounded-lg bg-[#66B5CB]/10 text-[#4a9db5] text-xs font-bold">
                            Sin foto
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-black">{c.titulo}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{c.descripcion}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{c.orden}</td>
                      <td className="px-6 py-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => abrirEdicionCaso(c)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-[#4a9db5] bg-[#66B5CB]/10 hover:bg-[#66B5CB]/20 transition-colors mr-2"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => eliminarCaso(c.id)}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {tab === 'mentores' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-lg text-black">
              Gestión de Mentores (Incuvalab)
              <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-brandRed bg-brandRed/10 rounded-full px-2 py-0.5">
                Solo lectura
              </span>
              <span className="ml-2 text-sm text-gray-500">({mentores.length})</span>
            </h2>
          </div>
          {cargando ? (
            <p className="p-10 text-center text-gray-500">Cargando mentores...</p>
          ) : mentores.length === 0 ? (
            <p className="p-10 text-center text-gray-500">No hay mentores registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Foto</th>
                    <th className="px-6 py-4 font-bold">Nombre</th>
                    <th className="px-6 py-4 font-bold">Teléfono</th>
                    <th className="px-6 py-4 font-bold">Área</th>
                    <th className="px-6 py-4 font-bold">Disponibilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {mentores.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        {m.image_url ? (
                          <img
                            src={m.image_url}
                            alt={m.nombre}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            className="w-11 h-11 rounded-full object-cover bg-gray-100"
                          />
                        ) : (
                          <span className="inline-flex w-11 h-11 items-center justify-center rounded-full bg-brandRed/10 text-brandRed font-bold">
                            {m.nombre?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-black">{m.nombre}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.telefono || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.area_experiencia || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{m.disponibilidad || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      {tab === 'proyectos' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-bold text-lg text-black">
              Proyectos activos (Crowdfunding)
              <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-brandBlue bg-brandBlue/10 rounded-full px-2 py-0.5">
                Solo lectura
              </span>
              <span className="ml-2 text-sm text-gray-500">({proyectos.length})</span>
            </h2>
          </div>
          {cargando ? (
            <p className="p-10 text-center text-gray-500">Cargando proyectos...</p>
          ) : proyectos.length === 0 ? (
            <p className="p-10 text-center text-gray-500">No hay proyectos registrados.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                  <tr>
                    <th className="px-6 py-4 font-bold">Imagen</th>
                    <th className="px-6 py-4 font-bold">Título</th>
                    <th className="px-6 py-4 font-bold">Categoría</th>
                    <th className="px-6 py-4 font-bold">Descripción</th>
                    <th className="px-6 py-4 font-bold">Creador</th>
                    <th className="px-6 py-4 font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {proyectos.map((p) => (
                    <tr key={p.IdProyecto} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-3">
                        {p.ImagenPrincipal ? (
                          <img
                            src={p.ImagenPrincipal}
                            alt={p.Titulo}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                            className="w-14 h-11 rounded-lg object-cover bg-gray-100"
                          />
                        ) : (
                          <span className="inline-flex w-14 h-11 items-center justify-center rounded-lg bg-brandBlue/10 text-brandBlue text-xs font-bold">
                            Sin foto
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 font-semibold text-black max-w-[220px] truncate">{p.Titulo}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{p.Categoria || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{p.DescripcionCorta || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {[p.NombreCreador, p.ApellidoCreador].filter(Boolean).join(' ') || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                            p.EstadoAprobacion === 'Activo'
                              ? 'bg-green-50 text-green-600 border border-green-100'
                              : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                          }`}
                        >
                          {p.EstadoAprobacion || '—'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : null}

      </div>
    </div>
  );
}

function isUnauthorized(err: unknown): boolean {
  if (err && typeof err === 'object' && 'response' in err) {
    const status = (err as { response?: { status?: number } }).response?.status;
    return status === 401 || status === 403;
  }
  return false;
}

export default AdminDashboard;