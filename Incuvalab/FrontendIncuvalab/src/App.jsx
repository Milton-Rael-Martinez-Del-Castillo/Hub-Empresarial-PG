// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import SubNav from "./components/SubNav";
import Footer from "./components/Footer";

import Home from "./components/pages/Home";
import QuienesSomos from "./components/pages/quienesSomos/QuienesSomos";
import Login from "./components/pages/Login";
import Register from "./components/login/Register";
import Mentoring from "./components/pages/Mentoring";
import Contact from "./components/pages/Contact";
import Revenue from "./components/pages/Revenue";
import Partners from "./components/pages/Partners";
import Inspiring from "./components/pages/Inspiring";
import Challengers from "./components/pages/Challengers";
import Eventos from "./components/pages/Eventos";
import Servicios from "./components/pages/Servicios";
import MoocsPage from "./components/pages/Moocs/MoocsPage";
import CrudRevenue from "./components/pages/CrudRevenue";
import CrudPartner from "./components/pages/CrudPartner";
import AdminDashboard from "./components/pages/admin/AdminDashboard";
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPassword from "./components/login/ForgotPassword";
import Help from "./components/login/Help";
import CrowdFunding from "./components/pages/CrowdFunding";
import { AuthProvider } from './components/login/AuthContext';
import CourseDetail from "./components/pages/courseDetail/CourseDetail";
import CourseContent from "./components/pages/courseContent/CourseContent";
import CourseBuilder from "./components/pages/courseBuilder/CourseBuilder";
import Profile from './components/pages/Profile';
import MyCourses from './components/pages/Moocs/MyCourses';
import Developers from './components/pages/Developers';
import MisMentees from './components/pages/MisMentees';
import MyTasks from './components/pages/MyTasks';


// Componente para controlar la visualización de elementos de navegación
function AppContent() {
  const location = useLocation();
  const hideNavAndFooter = location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/admin-dashboard" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/help";

  return (
    <div>
      {!hideNavAndFooter && <Navbar />}
      {!hideNavAndFooter && <SubNav />}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quienes-somos" element={<QuienesSomos />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/help" element={<Help />} />
          <Route path="/mentoring" element={<Mentoring />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/servicios" element={<Servicios />} />
          <Route path="/servicios/revenue" element={<Revenue />} />
          <Route path="/servicios/partners" element={<Partners />} />
          <Route path="/servicios/inspiring" element={<Inspiring />} />
          <Route path="/servicios/challengers" element={<Challengers />} />
          <Route path="/servicios/moocs" element={<MoocsPage />} />
          <Route path="/servicios/moocs/:courseId" element={<CourseDetail />} />
          <Route path="/crud-revenue" element={<CrudRevenue />} />
          <Route path="/crud-partner" element={<CrudPartner />} />
          <Route path="/crowdfunding" element={<CrowdFunding />} />
          <Route
            path="/curso/:courseId/contenido"
            element={
              <ProtectedRoute>
                <CourseContent />
              </ProtectedRoute>
            }
          />
          <Route path="/course-builder" element={<CourseBuilder />} />
          <Route path="/perfil" element={<Profile />} />
          <Route path="/mis-cursos" element={<MyCourses />} />
          <Route path="/mis-mentees" element={<MisMentees />} />
          <Route path="/mis-tareas" element={<MyTasks />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!hideNavAndFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
