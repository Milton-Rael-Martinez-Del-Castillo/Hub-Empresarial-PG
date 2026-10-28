// src/components/pages/AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminMentors from "../admin/AdminMentors";
import AdminInspiring from "../admin/AdminInspiring";
import AdminRevenue from "../admin/AdminRevenue";
import AdminEvents from "../admin/AdminEvents";
import AdminChallenger from "../admin/AdminChallenger";
import AdminLearning from "../admin/AdminLearning";
import AdminContacto from "../admin/AdminContacto";
import AdminMenteeReport from "../admin/AdminMenteeReport";
import axios from "axios";

function AdminDashboard() {
  const navigate = useNavigate();

  const [learningList, setLearningList] = useState([]);
  const [learningFormData, setLearningFormData] = useState({
    title: "",
    provider: "",
    image_url: "",
    logo_url: "",
    type: "",
    course_count: null,
    category: "",
    is_popular: false,
    is_new: false,
    is_trending: false
  });

  // Estados para Mentores
  const [mentors, setMentors] = useState([]);
  const [mentorFormData, setMentorFormData] = useState({
    nombre: "",
    telefono: "",
    area_experiencia: "",
    disponibilidad: "",
    image_url: ""
  });

  // Estados para Inspiring
  const [inspiringList, setInspiringList] = useState([]);
  const [inspiringFormData, setInspiringFormData] = useState({
    titulo: "",
    speaker: "",
    descripcion: "",
    imagen_url: "",
    video_url: "",
    contacto_email: ""
  });

  // Estados para Revenue (empresas_servicios)
  const [revenueList, setRevenueList] = useState([]);
  const [revenueFormData, setRevenueFormData] = useState({
    imagen_url: "",
    titulo: "",
    description: "",
    subtitulo: "",
    servicios: ""
  });

  // Estados para Eventos
  const [eventsList, setEventsList] = useState([]);
  const [eventFormData, setEventFormData] = useState({
    titulo: "",
    fecha: "",
    hora: "",
    lugar: "",
    descripcion: "",
    imagen_url: "",
    registro_url: ""
  });

  // Estados para Challenger
  const [challengersList, setChallengersList] = useState([]);
  const [challengerFormData, setChallengerFormData] = useState({
    title: "",
    image_url: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    contacto_email: "",
    destacado: false
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMentorForm, setShowMentorForm] = useState(false);
  const [showInspiringForm, setShowInspiringForm] = useState(false);
  const [showRevenueForm, setShowRevenueForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [currentMentor, setCurrentMentor] = useState(null);
  const [currentInspiring, setCurrentInspiring] = useState(null);
  const [currentRevenue, setCurrentRevenue] = useState(null);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [activeSection, setActiveSection] = useState('mentors');
  const [showChallengerForm, setShowChallengerForm] = useState(false);
  const [currentChallenger, setCurrentChallenger] = useState(null);
  const [showLearningForm, setShowLearningForm] = useState(false);
  const [currentLearning, setCurrentLearning] = useState(null);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [contactos, setContactos] = useState([]);
  const [contactosLoading, setContactosLoading] = useState(true);

  // Add to your useEffect
  const fetchContactos = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/contacto");
      if (!response.ok) throw new Error("Error al obtener contactos");
      const data = await response.json();
      setContactos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setContactosLoading(false);
    }
  };

  const fetchLearning = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/moocs/all-courses");
      if (!response.ok) throw new Error("Error al obtener MOOCs");
      const data = await response.json();

      console.log("Datos recibidos de la API:", data); // Para depuración

      // Verificamos si data.coursesByCategory existe y es un objeto
      if (data.coursesByCategory && typeof data.coursesByCategory === 'object') {
        // Aplanamos todos los cursos en un solo array
        const allCourses = Object.values(data.coursesByCategory).flat();
        console.log("Cursos aplanados:", allCourses); // Para depuración
        setLearningList(allCourses);
      } else {
        console.error("Estructura de datos inesperada:", data);
        setLearningList([]);
      }
    } catch (err) {
      console.error("Error al obtener MOOCs:", err);
      setError(err.message);
      setLearningList([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch de datos
  const fetchMentors = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/mentor");
      if (!response.ok) throw new Error("Error al obtener mentores");
      const data = await response.json();
      setMentors(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchInspiring = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/inspiring");
      if (!response.ok) throw new Error("Error al obtener inspiring");
      const data = await response.json();
      setInspiringList(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchRevenue = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/empresas_servicios");
      if (!response.ok) throw new Error("Error al obtener servicios de revenue");
      const data = await response.json();
      setRevenueList(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/eventos");
      if (!response.ok) throw new Error("Error al obtener eventos");
      const data = await response.json();
      setEventsList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchChallengers = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/challenger");
      if (!response.ok) throw new Error("Error al obtener challengers");
      const data = await response.json();
      setChallengersList(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
    fetchInspiring();
    fetchRevenue();
    fetchEvents();
    fetchChallengers();
    fetchLearning();
    fetchContactos();
  }, []);

  // Handlers para Mentores
  const handleMentorInputChange = (e) => {
    const { name, value } = e.target;
    setMentorFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentMentor
        ? `http://localhost:8000/api/mentor/${currentMentor.id}`
        : "http://localhost:8000/api/mentor";

      const method = currentMentor ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mentorFormData)
      });

      if (!response.ok) throw new Error("Error al guardar el mentor");

      fetchMentors();
      setShowMentorForm(false);
      setCurrentMentor(null);
      setMentorFormData({
        nombre: "",
        telefono: "",
        area_experiencia: "",
        disponibilidad: "",
        image_url: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMentorEdit = (mentor) => {
    setCurrentMentor(mentor);
    setMentorFormData({
      nombre: mentor.nombre,
      telefono: mentor.telefono,
      area_experiencia: mentor.area_experiencia,
      disponibilidad: mentor.disponibilidad,
      image_url: mentor.image_url
    });
    setShowMentorForm(true);
  };

  const handleMentorDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/mentor/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el mentor");

      fetchMentors();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handlers para Inspiring
  const handleInspiringInputChange = (e) => {
    const { name, value } = e.target;
    setInspiringFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInspiringSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentInspiring
        ? `http://localhost:8000/api/inspiring/${currentInspiring.id}`
        : "http://localhost:8000/api/inspiring";

      const method = currentInspiring ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inspiringFormData)
      });

      if (!response.ok) throw new Error("Error al guardar el inspiring");

      fetchInspiring();
      setShowInspiringForm(false);
      setCurrentInspiring(null);
      setInspiringFormData({
        titulo: "",
        speaker: "",
        descripcion: "",
        imagen_url: "",
        video_url: "",
        contacto_email: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleInspiringEdit = (inspiring) => {
    setCurrentInspiring(inspiring);
    setInspiringFormData({
      titulo: inspiring?.titulo || "",
      speaker: inspiring?.speaker || "",
      descripcion: inspiring?.descripcion || "",
      imagen_url: inspiring?.imagen_url || "",
      video_url: inspiring?.video_url || "",
      contacto_email: inspiring?.contacto_email || ""
    });
    setShowInspiringForm(true);
  };

  const handleInspiringDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/inspiring/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el inspiring");

      fetchInspiring();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handlers para Revenue
  const handleRevenueInputChange = (e) => {
    const { name, value } = e.target;
    setRevenueFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRevenueSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentRevenue
        ? `http://localhost:8000/api/empresas_servicios/${currentRevenue.id}`
        : "http://localhost:8000/api/empresas_servicios";

      const method = currentRevenue ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(revenueFormData)
      });

      if (!response.ok) throw new Error("Error al guardar el servicio");

      fetchRevenue();
      setShowRevenueForm(false);
      setCurrentRevenue(null);
      setRevenueFormData({
        imagen_url: "",
        titulo: "",
        descripcion: "",
        subtitulo: "",
        servicios: ""
      });
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleRevenueEdit = (revenue) => {
    setCurrentRevenue(revenue);
    setRevenueFormData({
      imagen_url: revenue?.imagen_url || "",
      titulo: revenue?.titulo || "",
      descripcion: revenue?.descripcion || "",
      subtitulo: revenue?.subtitulo || "",
      servicios: revenue?.servicios || ""
    });
    setShowRevenueForm(true);
  };

  const handleRevenueDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/empresas_servicios/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el servicio");

      fetchRevenue();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handlers para Eventos
  const handleEventInputChange = (e) => {
    const { name, value } = e.target;
    setEventFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentEvent
        ? `http://localhost:8000/api/eventos/${currentEvent.id}`
        : "http://localhost:8000/api/eventos";

      const method = currentEvent ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventFormData)
      });

      if (!response.ok) throw new Error("Error al guardar el evento");

      fetchEvents();
      setShowEventForm(false);
      setCurrentEvent(null);
      setEventFormData({
        titulo: "",
        fecha: "",
        hora: "",
        lugar: "",
        descripcion: "",
        imagen_url: "",
        registro_url: ""
      });
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleEventEdit = (event) => {
    setCurrentEvent(event);
    setEventFormData({
      titulo: event?.titulo || "",
      fecha: event?.fecha || "",
      hora: event?.hora || "",
      lugar: event?.lugar || "",
      descripcion: event?.descripcion || "",
      imagen_url: event?.imagen_url || "",
      registro_url: event?.registro_url || ""
    });
    setShowEventForm(true);
  };

  const handleEventDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/eventos/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el evento");

      fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handlers para Challenger
  const handleChallengerInputChange = (e) => {
    const { name, value } = e.target;
    setChallengerFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleChallengerSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentChallenger
        ? `http://localhost:8000/api/challenger/${currentChallenger.id}`
        : "http://localhost:8000/api/challenger";

      const method = currentChallenger ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(challengerFormData)
      });

      if (!response.ok) throw new Error("Error al guardar el challenger");

      fetchChallengers();
      setShowChallengerForm(false);
      setCurrentChallenger(null);
      setChallengerFormData({
        title: "",
        image_url: "",
        fecha: "",
        hora_inicio: "",
        hora_fin: "",
        contacto_email: "",
        destacado: false
      });
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  const handleChallengerEdit = (challenger) => {
    setCurrentChallenger(challenger);
    setChallengerFormData({
      title: challenger?.title || "",
      image_url: challenger?.image_url || "",
      fecha: challenger?.fecha || "",
      hora_inicio: challenger?.hora_inicio || "",
      hora_fin: challenger?.hora_fin || "",
      contacto_email: challenger?.contacto_email || "",
      destacado: challenger?.destacado || false
    });
    setShowChallengerForm(true);
  };

  const handleChallengerDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/challenger/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el challenger");

      fetchChallengers();
    } catch (err) {
      setError(err.message);
    }
  };


  const handleContactoDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/contacto/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el contacto");

      fetchContactos();
    } catch (err) {
      setError(err.message);
    }
  };
  // Add these handlers with other handlers
  const handleLearningInputChange = (e) => {
    const { name, value } = e.target;
    setLearningFormData(prev => ({ ...prev, [name]: value }));
  };
  // Update handleLearningSubmit
  const handleLearningSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentLearning
        ? `http://localhost:8000/api/moocs/${currentLearning.id}`
        : "http://localhost:8000/api/moocs";

      const method = currentLearning ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...learningFormData,
          course_count: learningFormData.course_count || null
        })
      });

      if (!response.ok) throw new Error("Error al guardar el MOOC");

      fetchLearning();
      setShowLearningForm(false);
      setCurrentLearning(null);
      setLearningFormData({
        title: "",
        provider: "",
        image_url: "",
        logo_url: "",
        type: "",
        course_count: null,
        category: "",
        is_popular: false,
        is_new: false,
        is_trending: false
      });
    } catch (err) {
      setError(`Error: ${err.message}`);
    }
  };

  // Update handleLearningEdit
  const handleLearningEdit = (mooc) => {
    setCurrentLearning(mooc);
    setLearningFormData({
      title: mooc.title || "",
      provider: mooc.provider || "",
      image_url: mooc.image_url || "",
      logo_url: mooc.logo_url || "",
      type: mooc.type || "",
      course_count: mooc.course_count || null,
      category: mooc.category || "",
      is_popular: mooc.is_popular || false,
      is_new: mooc.is_new || false,
      is_trending: mooc.is_trending || false
    });
    setShowLearningForm(true);
  };
  const handleLearningDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/moocs/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Error al eliminar el learning");

      fetchLearning();
    } catch (err) {
      setError(err.message);
    }
  };


  const handleLogout = async () => {
    try {
      setLogoutLoading(true);

      // Clear user data from localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      // Clear axios default headers (if any)
      delete axios.defaults.headers.common['Authorization'];

      // Redirect to login page
      navigate('/login');

      // Optional: Force a hard refresh to ensure all application state is cleared
      window.location.reload();

    } catch (error) {
      console.error('Error during logout:', error);
      // Even if there's an error, ensure we clear everything
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      navigate('/login');
    } finally {
      setLogoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0D37]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-[#8B0D37]">Panel de Administrador</h1>
          <button
            onClick={handleLogout}
            className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]"
          >
            Cerrar Sesión
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveSection('mentors')}
            className={`px-4 py-2 rounded hover:bg-[#6d0a2b] hover:text-white ${activeSection === 'mentors' ? 'bg-[#8B0D37] text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Gestión de Mentores
          </button>
          <button
            onClick={() => setActiveSection('inspiring')}
            className={`px-4 py-2 rounded hover:bg-[#6d0a2b] hover:text-white ${activeSection === 'inspiring' ? 'bg-[#8B0D37] text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Gestión de Inspiring
          </button>
          <button
            onClick={() => setActiveSection('revenue')}
            className={`px-4 py-2 rounded hover:bg-[#6d0a2b] hover:text-white ${activeSection === 'revenue' ? 'bg-[#8B0D37] text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Gestión de Revenue
          </button>
          <button
            onClick={() => setActiveSection('events')}
            className={`px-4 py-2 rounded hover:bg-[#6d0a2b] hover:text-white ${activeSection === 'events' ? 'bg-[#8B0D37] text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Gestión de Eventos
          </button>
          <button
            onClick={() => setActiveSection('challenger')}
            className={`px-4 py-2 rounded hover:bg-[#6d0a2b] hover:text-white ${activeSection === 'challenger' ? 'bg-[#8B0D37] text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Gestión de Challenger
          </button>

          <button
            onClick={() => setActiveSection('contactos')}
            className={`px-4 py-2 rounded hover:bg-[#6d0a2b] hover:text-white ${activeSection === 'contactos' ? 'bg-[#8B0D37] text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Gestión de Contactos
          </button>
          <button
            onClick={() => setActiveSection('menteeReport')}
            className={`px-4 py-2 rounded hover:bg-[#6d0a2b] hover:text-white ${activeSection === 'menteeReport' ? 'bg-[#8B0D37] text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Reporte Mentee
          </button>
        </div>

        {activeSection === 'contactos' && (
          <AdminContacto
            contactos={contactos}
            loading={contactosLoading}
            error={error}
            handleDelete={handleContactoDelete}
          />
        )}

        {activeSection === 'menteeReport' && (
          <AdminMenteeReport />
        )}

        {activeSection === 'mentors' && (
          <AdminMentors
            mentors={mentors}
            showForm={showMentorForm}
            currentMentor={currentMentor}
            formData={mentorFormData}
            handleInputChange={handleMentorInputChange}
            handleSubmit={handleMentorSubmit}
            setShowForm={setShowMentorForm}
            handleEdit={handleMentorEdit}
            handleDelete={handleMentorDelete}
          />
        )}

        {activeSection === 'inspiring' && (
          <AdminInspiring
            inspiringList={inspiringList}
            showForm={showInspiringForm}
            currentInspiring={currentInspiring}
            formData={inspiringFormData}
            handleInputChange={handleInspiringInputChange}
            handleSubmit={handleInspiringSubmit}
            setShowForm={setShowInspiringForm}
            handleEdit={handleInspiringEdit}
            handleDelete={handleInspiringDelete}
            setFormData={setInspiringFormData}
          />
        )}

        {activeSection === 'revenue' && (
          <AdminRevenue
            revenueList={revenueList}
            showForm={showRevenueForm}
            currentRevenue={currentRevenue}
            formData={revenueFormData}
            handleInputChange={handleRevenueInputChange}
            handleSubmit={handleRevenueSubmit}
            setShowForm={setShowRevenueForm}
            handleEdit={handleRevenueEdit}
            handleDelete={handleRevenueDelete}
          />
        )}

        {activeSection === 'events' && (
          <AdminEvents
            events={eventsList}
            showForm={showEventForm}
            currentEvent={currentEvent}
            formData={eventFormData}
            handleInputChange={handleEventInputChange}
            handleSubmit={handleEventSubmit}
            setShowForm={setShowEventForm}
            handleEdit={handleEventEdit}
            handleDelete={handleEventDelete}
          />
        )}

        {activeSection === 'challenger' && (
          <AdminChallenger
            challengers={challengersList}
            showForm={showChallengerForm}
            currentChallenger={currentChallenger}
            formData={challengerFormData}
            handleInputChange={handleChallengerInputChange}
            handleSubmit={handleChallengerSubmit}
            setShowForm={setShowChallengerForm}
            handleEdit={handleChallengerEdit}
            handleDelete={handleChallengerDelete}
          />
        )}

      </div>
    </div>
  );
}

export default AdminDashboard;