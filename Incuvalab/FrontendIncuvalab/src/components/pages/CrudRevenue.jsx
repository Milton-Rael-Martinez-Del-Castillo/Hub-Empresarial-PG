import React, { useState, useEffect } from 'react';

const CrudRevenue = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    institucion: '',
    descripcion: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/revenue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({ nombre: '', contacto: '', institucion: '', descripcion: '' });
        setError('');
        setShowErrorModal(false);
        setShowSuccessModal(true); // Show success modal
      } else {
        throw new Error('Hubo un problema al procesar tu solicitud. Por favor, inténtalo nuevamente más tarde.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('No se pudo enviar la solicitud. Verifica tu conexión a internet o intenta nuevamente más tarde.');
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl border-t-[10px] border-[#880043] font-montserrat"
      >
        <h2 className="text-2xl font-bold text-[#880043] mb-6 text-center">Formulario de Contacto</h2>

        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          />
        </div>

        {/* Contacto */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Contacto</label>
          <div className="flex space-x-2">
            <select
              name="codigo_pais"
              value={formData.codigo_pais || '+591'}
              onChange={(e) => setFormData({ ...formData, codigo_pais: e.target.value })}
              className="px-3 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
              required
            >
              <option value="+591">🇧🇴 +591</option>
              <option value="+54">🇦🇷 +54</option>
              <option value="+56">🇨🇱 +56</option>
              <option value="+57">🇨🇴 +57</option>
              <option value="+52">🇲🇽 +52</option>
              <option value="+1">🇺🇸 +1</option>
              {/* Puedes agregar más países aquí */}
            </select>
            <input
              type="tel"
              name="contacto"
              value={formData.contacto}
              onChange={(e) => {
                const val = e.target.value;
                if (/^\d*$/.test(val)) {
                  setFormData((prev) => ({ ...prev, contacto: val }));
                }
              }}
              placeholder="Ej: 77712345"
              className="flex-1 px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
              maxLength={15}
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Nombre del proyecto / institución</label>
          <input
            type="text"
            name="institucion"
            value={formData.institucion}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block mb-1 text-[#8d8d8d]">
            Breve descripción del apoyo que necesita de UNIVALLE
          </label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-[#66b5cb] text-white py-3 rounded-full font-semibold hover:bg-[#579fb3] transition-all"
        >
          Enviar
        </button>
      </form>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-red-600 text-2xl font-semibold mb-4">Error</h3>
            <p className="text-[#8d8d8d]">{error}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 w-full bg-[#880043] text-white py-3 rounded-full font-semibold hover:bg-[#b5656a] transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-green-600 text-2xl font-semibold mb-4">¡Formulario enviado!</h3>
            <p className="text-[#8d8d8d]">Gracias por contactarnos. Pronto nos pondremos en contacto contigo.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 w-full bg-[#66b5cb] text-white py-3 rounded-full font-semibold hover:bg-[#579fb3] transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudRevenue;
