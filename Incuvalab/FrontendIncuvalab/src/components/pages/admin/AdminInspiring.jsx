import React, { useState } from "react";

const AdminInspiring = ({
  inspiringList,
  showForm,
  currentInspiring,
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
  handleEdit,
  handleDelete,
  setFormData,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [inspiringToDelete, setInspiringToDelete] = useState(null);

  const openDeleteModal = (id) => {
    setInspiringToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setInspiringToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(inspiringToDelete);
    closeDeleteModal();
  };

  // Función para resetear el formulario
  const resetForm = () => {
    setFormData({
      titulo: "",
      speaker: "",
      descripcion: "",
      imagen_url: "",
      video_url: "",
      contacto_email: ""
    });
  };

  // Función para manejar el clic en "Agregar Nuevo"
  const handleAddNew = () => {
    resetForm();
    setShowForm(true);
    handleEdit(null);
  };

  // Función mejorada para manejar la cancelación
  const handleCancel = () => {
    resetForm();
    setShowForm(false);
    if (currentInspiring) {
      handleEdit(null); // Solo llamar a handleEdit si hay un currentInspiring
    }
  };

  return (
    <div className="p-4 max-w-full overflow-x-hidden">
      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmar Eliminación</h3>
            <p className="mb-6">¿Estás seguro de que deseas eliminar este inspiring? Esta acción no se puede deshacer.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={closeDeleteModal}
                className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-[#880043] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleAddNew}
          className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]"
        >
          + Añadir Nuevo Inspiring
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {currentInspiring ? "Editar Inspiring" : "Crear Nuevo Inspiring"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Título</label>
                <input
                  type="text"
                  name="titulo"
                  value={formData.titulo || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Speaker</label>
                <input
                  type="text"
                  name="speaker"
                  value={formData.speaker || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Descripción</label>
                <textarea
                  name="descripcion"
                  value={formData.descripcion || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows="3"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">URL de la Imagen</label>
                <input
                  type="text"
                  name="imagen_url"
                  value={formData.imagen_url || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">URL del Video</label>
                <input
                  type="text"
                  name="video_url"
                  value={formData.video_url || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Email de Contacto</label>
                <input
                  type="email"
                  name="contacto_email"
                  value={formData.contacto_email || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]"
              >
                {currentInspiring ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border text-left w-24">Imagen</th>
              <th className="py-3 px-4 border text-left">Título</th>
              <th className="py-3 px-4 border text-left">Speaker</th>
              <th className="py-3 px-4 border text-left">Descripción</th>
              <th className="py-3 px-4 border text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {inspiringList.length > 0 ? (
              inspiringList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-t">
                  <td className="py-3 px-4">
                    {item.imagen_url ? (
                      <img
                        src={item.imagen_url}
                        alt={item.titulo}
                        className="w-16 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/64";
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-300 rounded flex items-center justify-center">
                        {item.titulo.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">{item.titulo}</td>
                  <td className="py-3 px-4">{item.speaker}</td>
                  <td className="py-3 px-4">
                    <div className="line-clamp-2" title={item.descripcion}>
                      {item.descripcion}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => {
                          handleEdit(item);
                          setShowForm(true);
                        }}
                        className="bg-[#66B5CB] text-white px-3 py-1 rounded-lg font-medium cursor-pointer hover:opacity-90 text-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openDeleteModal(item.id)}
                        className="bg-[#880043] text-white px-3 py-1 rounded-lg font-medium cursor-pointer hover:opacity-90 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No hay inspiring registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminInspiring;