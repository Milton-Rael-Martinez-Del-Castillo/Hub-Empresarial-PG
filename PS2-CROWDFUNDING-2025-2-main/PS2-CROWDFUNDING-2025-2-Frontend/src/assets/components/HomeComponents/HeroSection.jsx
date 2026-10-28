import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../../public/logo.png";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleStartCampaign = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      // Usuario logueado → redirige a su perfil
      navigate("/Crear-Campania");
    } else {
      // No logueado → redirige a login
      navigate("/login");
    }
  };

  return (
    <section style={{
      background: 'linear-gradient(135deg, #66B5CB 0%, #880430 100%)',
      padding: '6rem 2rem',
      display: 'flex',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* Overlay transparente */}
      <div style={{
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        right: '2rem',
        bottom: '2rem',
        background: `
          linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%),
          radial-gradient(circle at 25% 30%, rgba(255,255,255,0.2) 0%, transparent 60%),
          radial-gradient(circle at 75% 70%, rgba(255,255,255,0.15) 0%, transparent 60%)
        `,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '24px',
        zIndex: 1
      }} />

      {/* Contenido principal */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '4rem',
        alignItems: 'center',
        padding: '2rem'
      }}>
        {/* Texto */}
        <div style={{ padding: '2rem' }}>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '2rem',
            lineHeight: '1.1'
          }}>¿Listo para empezar?</h1>
          <p style={{
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontSize: '1.4rem',
            color: '#000',
            marginBottom: '2rem',
            lineHeight: '1.6',
            opacity: 0.9
          }}>Únete ahora mismo a miles de personas.</p>
          
          {/* BOTÓN CON CONDICIÓN */}
          <button
            onClick={handleStartCampaign}
            style={{
              backgroundColor: '#880430',
              color: '#fff',
              padding: '20px 40px',
              borderRadius: '12px',
              fontSize: '1.3rem',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 12px 30px rgba(136,4,48,0.4)',
              border: 'none'
            }}
          >
            Iniciar Campaña
          </button>
        </div>

        {/* Círculo / Imagen */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '2rem'
        }}>
          <div style={{
            width: '80%',
            maxWidth: '450px',
            aspectRatio: '1',
            borderRadius: '50%',
            background: `
              linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%),
              radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%)
            `,
            backdropFilter: 'blur(25px)',
            border: '3px solid rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            position: 'relative',
            animation: 'pulseCircle 3s ease-in-out infinite'
          }}>
            <div style={{
              position: 'absolute',
              top: '20%',
              left: '20%',
              width: '60%',
              height: '60%',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
              filter: 'blur(40px)',
              zIndex: -1
            }} />

            <div style={{
              width: '80%',
              height: '80%',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img src={Logo} alt="Logo" style={{
                width: '70%',
                height: '70%',
                objectFit: 'contain'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Media queries + Animación */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulseCircle {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }

        @media (max-width: 1024px) {
          section div[style*='grid-template-columns'] {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          section h1 { font-size: 3rem !important; }
          section p { font-size: 1.2rem !important; }
        }
        @media (max-width: 480px) {
          section h1 { font-size: 2rem !important; }
          section p { font-size: 1rem !important; }
          section div[style*='padding: 2rem'] { padding: 1rem !important; }
        }
      `}} />
    </section>
  );
};

export { HeroSection };
export default HeroSection;
