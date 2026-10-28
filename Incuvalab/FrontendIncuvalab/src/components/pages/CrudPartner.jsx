import React, { useState, useEffect } from 'react';

const CrudProyecto = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    nombre_estudiante: '',
    semestre: '',
    carrera: '',
    contacto: '',
    nombre_proyecto: '',
    descripcion_proyecto: '',
    tipo_proyecto: '',
    requerimiento: '',
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/api/proyectos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          nombre_estudiante: '',
          semestre: '',
          carrera: '',
          contacto: '',
          nombre_proyecto: '',
          descripcion_proyecto: '',
          tipo_proyecto: '',
          requerimiento: '',
        });
        setShowSuccessModal(true);
        setShowErrorModal(false);
      } else throw new Error('Error al enviar el formulario');
    } catch (err) {
      setError('Hubo un error al enviar. Intenta más tarde.');
      setShowErrorModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl border-t-[10px] border-[#880043] font-montserrat"
      >
        <h2 className="text-2xl font-bold text-[#880043] mb-6 text-center">Registro de Proyecto</h2>

        {/* Nombre del estudiante */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Nombre del estudiante</label>
          <input
            type="text"
            name="nombre_estudiante"
            value={formData.nombre_estudiante}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          />
        </div>

        {/* Semestre como dropdown */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Semestre del estudiante</label>
          <select
            name="semestre"
            value={formData.semestre}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          >
            <option value="">Selecciona un semestre</option>
            {[...Array(8)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{`Semestre ${i + 1}`}</option>
            ))}
          </select>
        </div>

        {/* Carrera */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Carrera</label>
          <input
            type="text"
            name="carrera"
            value={formData.carrera}
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


        {/* Nombre del proyecto */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Nombre del proyecto</label>
          <input
            type="text"
            name="nombre_proyecto"
            value={formData.nombre_proyecto}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          />
        </div>

        {/* Descripción del proyecto */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Descripción del proyecto</label>
          <textarea
            name="descripcion_proyecto"
            value={formData.descripcion_proyecto}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          ></textarea>
        </div>

        {/* Tipo de proyecto */}
        <div className="mb-4">
          <label className="block mb-1 text-[#8d8d8d]">Tipo de proyecto</label>
          <select
            name="tipo_proyecto"
            value={formData.tipo_proyecto}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          >
            <option value="">Selecciona una opción</option>
            <option value="Proyecto de aula">Proyecto de aula</option>
            <option value="Proyecto de titulación">Proyecto de titulación</option>
            <option value="Proyecto personal">Proyecto personal</option>
          </select>
        </div>

        {/* Requerimiento */}
        <div className="mb-6">
          <label className="block mb-1 text-[#8d8d8d]">Requerimiento</label>
          <textarea
            name="requerimiento"
            value={formData.requerimiento}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-[#ccc] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#66b5cb]"
            required
          ></textarea>
        </div>

        {/* Botón */}
        <button
          type="submit"
          className="w-full bg-[#66b5cb] text-white py-3 rounded-full font-semibold"
        >
          Enviar
        </button>
      </form>

      {/* Modales */}
      {showErrorModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-red-600 text-2xl font-semibold mb-4">Error</h3>
            <p className="text-[#8d8d8d]">{error}</p>
            <button
              onClick={() => setShowErrorModal(false)}
              className="mt-4 w-full bg-[#880043] text-white py-3 rounded-full font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h3 className="text-green-600 text-2xl font-semibold mb-4">¡Formulario enviado!</h3>
            <p className="text-[#8d8d8d]">Tu proyecto fue registrado exitosamente.</p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-4 w-full bg-[#66b5cb] text-white py-3 rounded-full font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CrudProyecto;
