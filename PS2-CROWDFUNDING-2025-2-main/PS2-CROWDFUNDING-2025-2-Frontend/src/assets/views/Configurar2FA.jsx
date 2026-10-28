import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../styles/2faSeguridad.css";

export default function Configurar2FA({ userId }) {
  const [isActive, setIsActive] = useState(false);
  const [qr, setQr] = useState(null);
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/2fa/status/${userId}`);
        setIsActive(res.data.isActive);
        setVerified(res.data.isActive);
      } catch (error) {
        console.error("Error obteniendo estado 2FA:", error);
      }
    };
    fetch2FAStatus();
  }, [userId]);

  const handleToggle = async () => {
    if (!isActive) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/2fa/generate`, { userId });
        setQr(res.data.qrImage);
        setModalOpen(true); // Abrir modal para QR
      } catch (error) {
        console.error(error);
        alert("Error generando el QR");
      }
    } else {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/2fa/disable`, { userId });
        setVerified(false);
        setQr(null);
        setIsActive(false);
        alert("Doble factor desactivado correctamente");
      } catch (error) {
        console.error(error);
        alert("Error desactivando 2FA");
      }
    }
  };

  const handleVerify = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/2fa/verify`, { userId, token });
      if (res.data.success) {
        setVerified(true);
        setModalOpen(false);
        setIsActive(true);
        alert("Doble factor activado correctamente");
      } else {
        alert("Código incorrecto");
      }
    } catch (error) {
      console.error(error);
      alert("Error verificando el código");
    }
  };

  return (
    <div className="p-8 flex justify-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md flex flex-col gap-6">
        <h1 className="titulo">Seguridad de <span className="ColorTitulo">la cuenta</span></h1>

        {/* Switch moderno */}
        <div className="DobleConf">
          <p className="">
          Configura tu autenticación de doble factor para mayor seguridad.
          </p>
          <span className="">Doble factor (2FA) </span>
          <button
            onClick={handleToggle}
            className={`w-16 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${
              isActive ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-6 h-6 rounded-full shadow-md transform duration-300 ${
                isActive ? "translate-x-8" : ""
              }`}
            ></div>
          </button>
          <br />
          <button onClick={() => navigate(-1)} className="btn-volverA">
            ← Volver
          </button>
        </div>

        {verified && (
          <p className="text-green-600 font-semibold text-center mt-2">2FA activado</p>
        )}
      </div>

      {/* Modal inline */}
      {modalOpen && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <h2 className="text-xl font-semibold mb-2 text-center">Escanea el QR</h2>
            <p className="text-gray-600 text-center mb-4">
              Usa Google Authenticator o cualquier app de 2FA y luego ingresa el código.
            </p>
            <img src={qr} alt="QR Code" className="mb-4 w-48 h-48 object-contain" />
            <input
              type="text"
              placeholder="Código de 6 dígitos"
              className="border border-gray-300 px-3 py-2 rounded w-full text-center mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={token}
              onChange={(e) => setToken(e.target.value.replace(/\D/g, ""))}
            />
            <div style={{ display: "flex", justifyContent: "space-evenly", padding: "10px"}}>
              <button onClick={handleVerify} style={verifyBtn}>
                Verificar
              </button>
              <button onClick={() => setModalOpen(false)} style={cancelBtn}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Estilos inline del modal ---
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalStyle = {
  background: "#fff",
  padding: "2rem",
  borderRadius: "12px",
  width: "350px",
  textAlign: "center",
  boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
  color: "black",
  display: "grid",
  justifyItems: "center"
};

const verifyBtn = {
  background: "#528cb0 ",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};

const cancelBtn = {
  background: "#7a0c3f",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer",
};
