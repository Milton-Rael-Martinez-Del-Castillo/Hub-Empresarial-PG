import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaYoutube, FaLinkedin, FaPhone } from 'react-icons/fa';
import backgroundImage from '/fondo.jpg';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    correo: '',
    countryCode: '+591', 
    telefono: '',
    seleccion: '',
    mensaje: ''
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Lista de códigos de país
  const countryCodes = [
    { code: '+51', name: 'Perú (+51)' },
    { code: '+1', name: 'EEUU/Canadá (+1)' },
    { code: '+52', name: 'México (+52)' },
    { code: '+54', name: 'Argentina (+54)' },
    { code: '+56', name: 'Chile (+56)' },
    { code: '+57', name: 'Colombia (+57)' },
    { code: '+58', name: 'Venezuela (+58)' },
    { code: '+591', name: 'Bolivia (+591)' },
    { code: '+593', name: 'Ecuador (+593)' },
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };


  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setFormData({ ...formData, telefono: value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.nombres.trim()) {
      setError('Por favor ingresa tu nombre completo');
      return false;
    }

    if (!formData.correo.trim()) {
      setError('Por favor ingresa tu correo electrónico');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.correo)) {
      setError('Por favor ingresa un correo electrónico válido');
      return false;
    }

    if (!formData.telefono.trim()) {
      setError('Por favor ingresa tu número de teléfono');
      return false;
    }

    if (formData.telefono.length < 7) {
      setError('El número de teléfono debe tener al menos 7 dígitos');
      return false;
    }

    if (!formData.seleccion) {
      setError('Por favor selecciona un tipo de consulta');
      return false;
    }

    if (!formData.mensaje.trim()) {
      setError('Por favor escribe tu mensaje');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const telefonoCompleto = `${formData.countryCode}${formData.telefono}`;
      
      const response = await fetch('http://localhost:8000/api/contacto', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: formData.nombres,
          email: formData.correo,
          telefono: telefonoCompleto, // Enviamos el número completo con código
          tipo_consulta: formData.seleccion,
          mensaje: formData.mensaje
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al enviar el formulario');
      }

      setSuccessMessage('¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.');
      
      // Reset form
      setFormData({
        nombres: '',
        correo: '',
        countryCode: '+51',
        telefono: '',
        seleccion: '',
        mensaje: ''
      });

    } catch (error) {
      console.error('Error al enviar:', error);
      setError(error.message || 'Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="bg-black bg-opacity-60 min-h-screen w-full px-4 py-10 text-white">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2">¡Es Fácil Contactarnos!</h2>
          <p className="text-lg">Completa el formulario y con gusto te atenderemos</p>
        </div>

        <div className="flex justify-center items-center">
          <div className="w-full max-w-xl bg-white bg-opacity-90 rounded-lg p-8 shadow-lg text-black">
            {successMessage && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
                {successMessage}
              </div>
            )}
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  name="nombres"
                  value={formData.nombres}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                  type="text"
                  placeholder="Nombre completo"
                />
              </div>

              <div>
                <input
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                  type="email"
                  placeholder="Correo electrónico"
                />
              </div>

              {/* Campo de teléfono mejorado */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <div className="flex rounded-md shadow-sm">
                  {/* Selector de código de país */}
                  <select
                    name="countryCode"
                    value={formData.countryCode}
                    onChange={handleChange}
                    className="h-full py-2 pl-3 pr-7 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#8B0D37] focus:border-[#8B0D37]"
                  >
                    {countryCodes.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                  
                  {/* Input de número telefónico */}
                  <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      name="telefono"
                      value={formData.telefono}
                      onChange={handlePhoneChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-[#8B0D37] focus:border-[#8B0D37]"
                      type="tel"
                      placeholder="123456789"
                      maxLength="15"
                    />
                  </div>
                </div>
              </div>

              <div>
                <select
                  name="seleccion"
                  value={formData.seleccion}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                >
                  <option value="">- Selecciona el tipo de consulta -</option>
                  <option value="Consulta general">Consulta general</option>
                  <option value="Soporte técnico">Soporte técnico</option>
                  <option value="Información de servicios">Información de servicios</option>
                  <option value="Colaboraciones">Colaboraciones</option>
                </select>
              </div>

              <div>
                <textarea
                  name="mensaje"
                  value={formData.mensaje}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
                  placeholder="Escribe tu mensaje..."
                  rows="4"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-[#66B5CB] text-white py-2 rounded hover:bg-[#80a7b2] transition duration-300 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>
        </div>

        {/* Redes sociales */}
        <div className="text-center mt-10">
          <div className="flex justify-center space-x-6 text-3xl">
            <a href="https://facebook.com/incuvalab_oficial" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="text-white hover:text-[#880043] cursor-pointer transition" />
            </a>
            <a href="https://instagram.com/incuvalab_oficial" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-white hover:text-[#880043] cursor-pointer transition" />
            </a>
            <a href="https://youtube.com/incuvalab_oficial" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-white hover:text-[#880043] cursor-pointer transition" />
            </a>
            <a href="https://linkedin.com/company/incuvalab_oficial" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-white hover:text-[#880043] cursor-pointer transition" />
            </a>
          </div>
          <div className="mt-4 text-white">
            <p>También podemos estar en contacto a través de nuestras redes sociales.</p>
            <p>Encuéntranos como: <strong>@incuvalab_oficial</strong></p>
          </div>
        </div>

        {/* Botón volver al inicio */}
        <div className="text-center mt-10">
          <a
            href="/"
            className="inline-block px-6 py-2 border border-white rounded text-white hover:bg-white hover:text-[#66B5CB] transition duration-300"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;