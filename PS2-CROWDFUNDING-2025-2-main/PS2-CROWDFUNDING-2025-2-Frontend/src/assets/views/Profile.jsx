import { useState, useEffect } from "react";
import "../../styles/Profile.css";
import { Link } from "react-router-dom";

function Profile() {
  const [activeAccordion, setActiveAccordion] = useState(0);
  const [user, setUser] = useState(null);

  const [misProyectos, setMisProyectos] = useState([]);
  const [campanasDonadas, setCampanasDonadas] = useState([]);
  const [proyectosCompletos, setProyectosCompletos] = useState([]);
  const [proyectosIncompletos, setProyectosIncompletos] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar usuario
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  // Cargar proyectos y clasificarlos
  useEffect(() => {
    if (!user) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/creados/${user.IdUser}`)
      .then((res) => res.json())
      .then((data) => {
        const hoy = new Date();

        // COMPLETOS
        setProyectosCompletos(
          data.filter((p) => p.EstadoCierre === "FinalizadoExitoso")
        );

        // INCOMPLETOS
        setProyectosIncompletos(
          data.filter((p) => p.EstadoCierre === "FinalizadoIncompleto")
        );

        // SOLO VIGENTES Y APROBADOS PARA "MIS CAMPAÑAS"
        const vigentes = data.filter((p) => {
          const inicio = new Date(p.FechaInicio);
          const fin = new Date(p.FechaFin);
          return (
            p.EstadoAprobacion === "Activo" &&
            (p.EstadoCierre === null || p.EstadoCierre === "Activo") &&
            hoy >= inicio &&
            hoy <= fin
          );
        });

        setMisProyectos(vigentes);
      })
      .catch((err) => console.error(err));

    // PROYECTOS SEGUIDOS
    fetch(`${import.meta.env.VITE_API_URL}/api/proyectos/donados/${user.IdUser}`)
      .then((res) => res.json())
      .then((data) => setCampanasDonadas(data))
      .catch((err) => console.error(err));
  }, [user]);

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? -1 : index);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return alert("Selecciona una imagen primero.");

    const formData = new FormData();
    formData.append("imagen", selectedFile);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/usuarios/editar/${user.IdUser}`,
        { method: "PUT", body: formData }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al actualizar");

      const updatedUser = { ...user, ...data.data };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setModalOpen(false);
      alert("Perfil actualizado correctamente");
    } catch (err) {
      console.error(err);
      alert("Error al actualizar perfil");
    }
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="profile-container">
      <aside className="profile-left">
        <div className="profile-avatar">
          {user.ImagenPerfil ? <img src={user.ImagenPerfil} alt="avatar" /> : <span>👤</span>}
        </div>

        <h2 className="profile-title">Mi Perfil</h2>
        <h3 className="profile-name">{user.Nombre} {user.PrimerApellido}</h3>
        <p className="profile-username">@{user.NombreUsuario}</p>

        <div className="profile-links">
          <Link to="/configurar-2fa">Configurar Cuenta</Link>
          <a href="#" onClick={() => setModalOpen(true)}>Editar Perfil</a>
        </div>

        <div className="profile-stats">
          <div>
            <strong>{misProyectos.length}</strong>
            <span>PROYECTOS</span>
          </div>
          <div>
            <strong>{campanasDonadas.length}</strong>
            <span>PROYECTOS SEGUIDOS</span>
          </div>
        </div>

        <div className="profile-info">
          <p><strong>Email</strong><br />{user.Correo}</p>
          <p><strong>Número de teléfono</strong><br />{user.Telefono || "No registrado"}</p>
          <p><strong>Participa desde</strong><br />{new Date(user.FechaCreacion).toLocaleDateString()}</p>
        </div>
        <Link to="/">Volver a la pagina principal</Link>
      </aside>

      <section className="profile-right">
        <h2 className="dashboard-title">Mi Panel de control</h2>

        <div className="accordion">
          {/* --- CAMPANAS SEGUIDAS --- */}
          <div className="accordion-item">
            <div className={`accordion-header ${activeAccordion === 1 ? "active" : ""}`}
                 onClick={() => toggleAccordion(1)}>
              Campañas a las que apoyas
              <span className="arrow">{activeAccordion === 1 ? "⌃" : "⌄"}</span>
            </div>
            {activeAccordion === 1 && (
              <div className="accordion-body">
                {campanasDonadas.length === 0 ? (
                  <p>Aún no has dado me gusta a ninguna campaña.</p>
                ) : (
                  <div className="proyectos-cards">
                    {campanasDonadas.map((proyecto) => (
                      <div key={proyecto.IdProyecto} className="card">
                        {proyecto.ImagenPrincipal ? (
                          <img src={`${import.meta.env.VITE_API_URL}${proyecto.ImagenPrincipal}`} alt={proyecto.Titulo} />
                        ) : <div className="card-placeholder">No hay imagen</div>}
                        <h4>{proyecto.Titulo}</h4>
                        <Link to={`/proyecto/${proyecto.IdProyecto}`}>Ver proyecto</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- MIS CAMPAÑAS (SOLO VIGENTES Y APROBADAS) --- */}
          <div className="accordion-item">
            <div className={`accordion-header ${activeAccordion === 2 ? "active" : ""}`}
                 onClick={() => toggleAccordion(2)}>
              Mis Campañas
              <span className="arrow">{activeAccordion === 2 ? "⌃" : "⌄"}</span>
            </div>
            {activeAccordion === 2 && (
              <div className="accordion-body">
                <div className="proyectos-cards">
                  <div className="card crear-campania">
                    <Link to="/Crear-Campania" style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      textAlign: "center",
                      color: "#fff",
                      fontWeight: "bold",
                      backgroundColor: "#56b6c2",
                      borderRadius: "6px",
                      padding: "20px",
                      textDecoration: "none",
                    }}>+ Crear nueva campaña</Link>
                  </div>

                  {misProyectos.length === 0 ? (
                    <p style={{ marginTop: "10px" }}>No tienes campañas vigentes.</p>
                  ) : (
                    misProyectos.map((proyecto) => {
                      const hoy = new Date();
                      const inicio = new Date(proyecto.FechaInicio);
                      const fin = new Date(proyecto.FechaFin);
                      const editable = hoy >= inicio && hoy <= fin;

                      return (
                        <div key={proyecto.IdProyecto} className="card">
                          {proyecto.ImagenPrincipal ? (
                            <img src={`${import.meta.env.VITE_API_URL}${proyecto.ImagenPrincipal}`} alt={proyecto.Titulo} />
                          ) : <div className="card-placeholder">No hay imagen</div>}
                          <h4>{proyecto.Titulo}</h4>
                          <Link to={`/proyecto/${proyecto.IdProyecto}`}>Ver proyecto</Link>
                          {editable && <Link to={`/usuario/editar-proyecto/${proyecto.IdProyecto}`}>Editar Proyecto</Link>}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* --- COMPLETADAS --- */}
          <div className="accordion-item">
            <div className={`accordion-header ${activeAccordion === 3 ? "active" : ""}`}
                 onClick={() => toggleAccordion(3)}>
              Campañas Completadas
              <span className="arrow">{activeAccordion === 3 ? "⌃" : "⌄"}</span>
            </div>
            {activeAccordion === 3 && (
              <div className="accordion-body">
                {proyectosCompletos.length === 0 ? (
                  <p>No tienes campañas finalizadas exitosamente.</p>
                ) : (
                  <div className="proyectos-cards">
                    {proyectosCompletos.map((proyecto) => (
                      <div key={proyecto.IdProyecto} className="card">
                        {proyecto.ImagenPrincipal ? (
                          <img src={`${import.meta.env.VITE_API_URL}${proyecto.ImagenPrincipal}`} alt={proyecto.Titulo} />
                        ) : <div className="card-placeholder">No hay imagen</div>}
                        <h4>{proyecto.Titulo}</h4>
                        <Link to={`/proyecto/${proyecto.IdProyecto}`}>Ver proyecto</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* --- INCOMPLETAS --- */}
          <div className="accordion-item">
            <div className={`accordion-header ${activeAccordion === 4 ? "active" : ""}`}
                 onClick={() => toggleAccordion(4)}>
              Campañas No Completadas
              <span className="arrow">{activeAccordion === 4 ? "⌃" : "⌄"}</span>
            </div>
            {activeAccordion === 4 && (
              <div className="accordion-body">
                {proyectosIncompletos.length === 0 ? (
                  <p>No tienes campañas incompletas.</p>
                ) : (
                  <div className="proyectos-cards">
                    {proyectosIncompletos.map((proyecto) => (
                      <div key={proyecto.IdProyecto} className="card">
                        {proyecto.ImagenPrincipal ? (
                          <img src={`${import.meta.env.VITE_API_URL}${proyecto.ImagenPrincipal}`} alt={proyecto.Titulo} />
                        ) : <div className="card-placeholder">No hay imagen</div>}
                        <h4>{proyecto.Titulo}</h4>
                        <Link to={`/proyecto/${proyecto.IdProyecto}`}>Ver proyecto</Link>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MODAL FOTO PERFIL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Actualizar Foto de Perfil</h3>
            <form onSubmit={handleImageUpload} className="modal-form">
              <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} />
              <div className="modal-buttons">
                <button type="submit" className="btn-primary">Actualizar</button>
                <button type="button" className="btn-cancel" onClick={() => setModalOpen(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
