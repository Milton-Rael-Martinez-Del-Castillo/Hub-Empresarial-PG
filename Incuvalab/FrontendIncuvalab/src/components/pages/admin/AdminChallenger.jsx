import React, { useState } from "react";

const AdminChallenger = ({
  challengers,
  showForm,
  currentChallenger,
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
  handleEdit,
  handleDelete,
  setFormData,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [challengerToDelete, setChallengerToDelete] = useState(null);

  const openDeleteModal = (id) => {
    setChallengerToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setChallengerToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(challengerToDelete);
    closeDeleteModal();
  };

  // Función para formatear la fecha al formato YYYY-MM-DD para el input date
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Función para resetear el formulario a valores iniciales
  const resetForm = () => {
    setFormData({
      title: "",
      image_url: "",
      fecha: "",
      hora_inicio: "",
      hora_fin: "",
      contacto_email: "",
      destacado: false
    });
  };

  const handleAddNew = () => {
    handleEdit(null);
    resetForm();
    setShowForm(true);
  };

  // Función para manejar la cancelación
  const handleCancel = () => {
    setShowForm(false);
  };

  // Manejar edición de un challenger existente
  const handleEditChallenger = (challenger) => {
    // Formatear la fecha antes de pasarla al formulario
    const challengerToEdit = {
      ...challenger,
      fecha: formatDateForInput(challenger.fecha)
    };
    handleEdit(challengerToEdit);
    setShowForm(true);
  };

  return (
    <div className="p-4 max-w-full overflow-x-hidden">
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmar Eliminación</h3>
            <p className="mb-6">¿Estás seguro de que deseas eliminar este challenger?</p>
            <div className="flex justify-end gap-3">
              <button onClick={closeDeleteModal} className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg">Cancelar</button>
              <button onClick={confirmDelete} className="bg-[#880043] text-white px-4 py-2 rounded-lg">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex justify-between items-center">
        <button
          onClick={handleAddNew}
          className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b] flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
           Añadir Nuevo Challenger
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {currentChallenger ? "Editar Challenger" : "Crear Nuevo Challenger"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Título</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#8B0D37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">URL de la Imagen</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#8B0D37] focus:border-transparent"
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Fecha</label>
                <input
                  type="date"
                  name="fecha"
                  value={formData.fecha || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#8B0D37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Hora Inicio</label>
                <input
                  type="time"
                  name="hora_inicio"
                  value={formData.hora_inicio || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#8B0D37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Hora Fin</label>
                <input
                  type="time"
                  name="hora_fin"
                  value={formData.hora_fin || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#8B0D37] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 font-medium">Email de Contacto</label>
                <input
                  type="email"
                  name="contacto_email"
                  value={formData.contacto_email || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-[#8B0D37] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="destacado"
                  checked={formData.destacado || false}
                  onChange={(e) => handleInputChange({
                    target: {
                      name: "destacado",
                      value: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-[#8B0D37] focus:ring-[#8B0D37] border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 font-medium">Destacado</label>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b] transition-colors">
                {currentChallenger ? "Actualizar" : "Guardar"}
              </button>
              <button 
                type="button" 
                onClick={handleCancel} 
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Challengers Table */}
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 text-left w-24">Imagen</th>
              <th className="py-3 px-4 text-left min-w-[180px]">Título</th>
              <th className="py-3 px-4 text-left">Fecha</th>
              <th className="py-3 px-4 text-left">Horario</th>
              <th className="py-3 px-4 text-left">Contacto</th>
              <th className="py-3 px-4 text-left">Destacado</th>
              <th className="py-3 px-4 text-left w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {challengers.length > 0 ? (
              challengers.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-t">
                  <td className="py-3 px-4">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/64";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-[#8B0D37] to-[#880043] rounded flex flex-col items-center justify-center text-white text-xs font-bold text-center p-1">
                        <span>Sin</span>
                        <span>Imagen</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-800">{item.title}</td>
                  <td className="py-3 px-4 text-gray-700">
                    {new Date(item.fecha).toLocaleDateString('es-ES')}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    {item.hora_inicio} - {item.hora_fin}
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    <a href={`mailto:${item.contacto_email}`} className="text-[#8B0D37] hover:underline">
                      {item.contacto_email}
                    </a>
                  </td>
                  <td className="py-3 px-4">
                    {item.destacado ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Sí
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditChallenger(item)} 
                        className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => openDeleteModal(item.id)} 
                        className="bg-[#880043] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    No hay challengers registrados
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminChallenger;