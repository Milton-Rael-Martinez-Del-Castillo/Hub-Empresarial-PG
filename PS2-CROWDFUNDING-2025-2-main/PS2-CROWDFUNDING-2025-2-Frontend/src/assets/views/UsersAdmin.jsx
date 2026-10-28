// src/assets/views/UsersAdmin.jsx
import "@/styles/UsersAdmin.css";
import { useEffect, useMemo, useState, useRef } from "react";
import {
  getUsers,
  getUser,
  createUser,
  updateUser,
  softDeleteUser,
  restoreUser,
} from "@/assets/services/api";
import { Link } from "react-router-dom";

const emptyForm = {
  NombreUsuario: "",
  Nombre: "",
  PrimerApellido: "",
  SegundoApellido: "",
  Correo: "",
  ImagenPerfil: "",
  Telefono: "",
  Id_Rol: 2,
  Contrasenia: "",
  Estado: true,
};

export default function UsersAdmin() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  //  ref para scroll al formulario
  const formRef = useRef(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getUsers({ includeDeleted: showDeleted ? 1 : 0 });
      setList(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [showDeleted]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return list;
    return list.filter(
      (u) =>
        u.NombreUsuario?.toLowerCase().includes(term) ||
        u.Nombre?.toLowerCase().includes(term) ||
        u.PrimerApellido?.toLowerCase().includes(term) ||
        u.SegundoApellido?.toLowerCase().includes(term) ||
        u.Correo?.toLowerCase().includes(term)
    );
  }, [list, q]);

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowPwd(false);
    scrollToForm(); //  scroll al formulario al crear
  };

  const startEdit = async (id) => {
    try {
      setSaving(true);
      const u = await getUser(id);
      setEditingId(id);
      setForm({
        NombreUsuario: u.NombreUsuario ?? "",
        Nombre: u.Nombre ?? "",
        PrimerApellido: u.PrimerApellido ?? "",
        SegundoApellido: u.SegundoApellido ?? "",
        Correo: u.Correo ?? "",
        ImagenPerfil: u.ImagenPerfil ?? "",
        Telefono: u.Telefono ?? "",
        Id_Rol: u.Id_Rol ?? 2,
        Contrasenia: "",
        Estado: u.Estado ?? true,
      });
      setShowPwd(false);
      scrollToForm(); //  scroll al formulario al editar
    } catch (e) {
      alert(e.message || "No se pudo cargar el usuario");
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...form,
        Id_Rol: Number(form.Id_Rol) || 2,
      };

      if (editingId) {
        if (!payload.Contrasenia) delete payload.Contrasenia;
        await updateUser(editingId, payload);
      } else {
        if (!payload.Contrasenia || payload.Contrasenia.length < 6) {
          throw new Error("La contraseña es obligatoria (mínimo 6 caracteres).");
        }
        await createUser(payload);
      }

      await load();
      startCreate();
    } catch (e2) {
      setError(e2.message || "No se pudo guardar");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!confirm("¿Eliminar (lógico) este usuario?")) return;
    try {
      await softDeleteUser(id);
      await load();
    } catch (e) {
      alert(e.message || "No se pudo eliminar");
    }
  };

  const onRestore = async (id) => {
    try {
      await restoreUser(id);
      await load();
    } catch (e) {
      alert(e.message || "No se pudo restaurar");
    }
  };

  return (
    <div className="users-admin">
      <header className="ua-header">
        <div>
          <h1>Administración de Usuarios</h1>
          <Link to="/admin/perfil">Volver al Panel de Control</Link>
        </div>
        <div className="ua-controls">
          <input
            type="search"
            placeholder="Buscar…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="ua-check">
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            Mostrar eliminados
          </label>
          <button className="ua-primary" onClick={startCreate}>
            + Agregar usuario
          </button>
        </div>
      </header>

      {error && <div className="ua-error">{error}</div>}

      <section className="ua-grid">
        <div className="ua-list">
          {loading ? (
            <div className="ua-empty">Cargando…</div>
          ) : filtered.length === 0 ? (
            <div className="ua-empty">Sin resultados</div>
          ) : (
            filtered.map((u) => (
              <article
                key={u.IdUser}
                className={`ua-card ${u.Eliminado ? "is-deleted" : ""}`}
              >
                <div className="ua-card-body">
                  <div className="ua-avatar">
                    {u.ImagenPerfil ? (
                      <img src={u.ImagenPerfil} alt={u.NombreUsuario} />
                    ) : (
                      <div className="ua-no-avatar">Sin imagen</div>
                    )}
                  </div>
                  <div className="ua-info">
                    <h3>
                      {u.Nombre} {u.PrimerApellido} {u.SegundoApellido || ""}
                      <span className="ua-muted">(@{u.NombreUsuario})</span>
                    </h3>
                    <p className="ua-muted">{u.Correo}</p>
                    <p className="ua-meta">
                      Tel: {u.Telefono || "N/A"}
                    </p>
                    <p className="ua-meta">
                      Rol: {Number(u.Id_Rol) === 1 ? "Admin" : "Usuario"}{" "}
                      {u.Eliminado ? <span className="ua-badge danger">eliminado</span> : null}
                    </p>
                  </div>
                </div>

                <div className="ua-actions">
                  <button onClick={() => startEdit(u.IdUser)}>Editar</button>
                  {u.Eliminado ? (
                    <button className="ua-success" onClick={() => onRestore(u.IdUser)}>
                      Restaurar
                    </button>
                  ) : (
                    <button className="ua-danger" onClick={() => onDelete(u.IdUser)}>
                      Borrar
                    </button>
                  )}
                </div>
              </article>
            ))
          )}
        </div>

        {/*  agregamos ref al contenedor del formulario */}
        <div className="ua-form" ref={formRef}>
          <h2>{editingId ? "Editar usuario" : "Nuevo usuario"}</h2>
          <form onSubmit={onSubmit} className="ua-form-grid">
            <label>
              Usuario
              <input
                value={form.NombreUsuario}
                onChange={(e) => setForm({ ...form, NombreUsuario: e.target.value })}
                {...(!editingId ? { required: true } : {})}
              />
            </label>

            <label>
              Nombre
              <input
                value={form.Nombre}
                onChange={(e) => setForm({ ...form, Nombre: e.target.value })}
                {...(!editingId ? { required: true } : {})}
              />
            </label>

            <label>
              Primer Apellido
              <input
                value={form.PrimerApellido}
                onChange={(e) => setForm({ ...form, PrimerApellido: e.target.value })}
                {...(!editingId ? { required: true } : {})}
              />
            </label>

            <label>
              Segundo Apellido
              <input
                value={form.SegundoApellido}
                onChange={(e) => setForm({ ...form, SegundoApellido: e.target.value })}
              />
            </label>

            <label className="ua-col-2">
              Correo
              <input
                type="email"
                value={form.Correo}
                onChange={(e) => setForm({ ...form, Correo: e.target.value })}
                {...(!editingId ? { required: true } : {})}
              />
            </label>

            <label className="ua-col-2">
              Teléfono
              <input
                value={form.Telefono}
                onChange={(e) => setForm({ ...form, Telefono: e.target.value })}
              />
            </label>

            <label className="ua-col-2">
              Contraseña {editingId && <span className="ua-muted"></span>}
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  type={showPwd ? "text" : "password"}
                  value={form.Contrasenia}
                  onChange={(e) => setForm({ ...form, Contrasenia: e.target.value })}
                  placeholder={editingId ? "Dejar vacío para no cambiar" : "Mínimo 6 caracteres"}
                  {...(!editingId ? { required: true, minLength: 6 } : {})}
                />
                <button
                  type="button"
                  className="ua-ghost"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? "Ocultar" : "Ver"}
                </button>
              </div>
            </label>

            <label>
              Rol
              <select
                value={form.Id_Rol}
                onChange={(e) => setForm({ ...form, Id_Rol: Number(e.target.value) })}
              >
                <option value={1}>Admin</option>
                <option value={2}>Usuario</option>
              </select>
            </label>

            <label>
              Estado
              <select
                value={form.Estado ? 1 : 0}
                onChange={(e) => setForm({ ...form, Estado: e.target.value === "1" })}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </label>

            <div className="ua-form-actions ua-col-2">
              <button type="submit" className="ua-primary" disabled={saving}>
                {saving ? "Guardando…" : editingId ? "Actualizar" : "Crear"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={startCreate}
                  className="ua-ghost"
                  disabled={saving}
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
