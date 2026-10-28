// src/components/admin/AdminContacto.jsx
import React, { useState, useEffect } from 'react';

const AdminContacto = ({ contactos, loading, error, handleDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedContacto, setSelectedContacto] = useState(null);

  const filteredContactos = contactos.filter(contacto =>
    contacto.nombres.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contacto.seleccion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = (contacto) => {
    setSelectedContacto(contacto);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    if (selectedContacto) {
      handleDelete(selectedContacto.id);
      setShowModal(false);
      setSelectedContacto(null);
    }
  };

  const handleCancelDelete = () => {
    setShowModal(false);
    setSelectedContacto(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8B0D37]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-[#8B0D37] mb-4">Contactos Recibidos</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar contactos..."
          className="w-full p-2 border border-[#8B0D37] rounded focus:outline-none focus:ring-2 focus:ring-[#8B0D37]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="py-2 px-4 text-left">Fecha</th>
              <th className="py-2 px-4 text-left">Nombre</th>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Teléfono</th>
              <th className="py-2 px-4 text-left">Tipo de Consulta</th>
              <th className="py-2 px-4 text-left">Mensaje</th>
              <th className="py-2 px-4 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredContactos.length > 0 ? (
              filteredContactos.map((contacto) => (
                <tr key={contacto.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-4">{new Date(contacto.envio_formulario).toLocaleString()}</td>
                  <td className="py-2 px-4">{contacto.nombres}</td>
                  <td className="py-2 px-4">{contacto.correo}</td>
                  <td className="py-2 px-4">{contacto.telefono}</td>
                  <td className="py-2 px-4">{contacto.seleccion}</td>
                  <td className="py-2 px-4 max-w-xs truncate" title={contacto.mensaje_enviado}>
                    {contacto.mensaje_enviado}
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => confirmDelete(contacto)}
                      className="bg-[#880043] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No se encontraron contactos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">¿Estás seguro?</h3>
            <p className="mb-6">
              ¿Deseas eliminar el contacto <strong>{selectedContacto?.nombres}</strong>? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCancelDelete}
                className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="bg-[#880043] text-white px-4 py-2 rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacto;
