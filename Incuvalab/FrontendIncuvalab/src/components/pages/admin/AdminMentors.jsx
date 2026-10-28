// src/components/admin/AdminMentors.jsx
import React, { useState } from "react";

function AdminMentors({
  mentors,
  showForm,
  currentMentor,
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
  handleEdit,
  handleDelete
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [mentorToDelete, setMentorToDelete] = useState(null);

  const openDeleteModal = (id) => {
    setMentorToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setMentorToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(mentorToDelete);
    closeDeleteModal();
  };

  return (
    <div>
      {/* Modal de confirmación para eliminar */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmar Eliminación</h3>
            <p className="mb-6">¿Estás seguro de que deseas eliminar este mentor? Esta acción no se puede deshacer.</p>
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
          onClick={() => {
            setShowForm(true);
            setCurrentMentor(null);
          }}
          className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]"
        >
          + Añadir Nuevo Mentor
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {currentMentor ? "Editar Mentor" : "Crear Nuevo Mentor"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Teléfono</label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={(e) =>
                    handleInputChange({
                      target: {
                        name: 'telefono',
                        value: e.target.value.replace(/\D/g, '') // ❗ elimina todo lo que no sea número
                      }
                    })
                  }
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Área de Experiencia</label>
                <input
                  type="text"
                  name="area_experiencia"
                  value={formData.area_experiencia}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Disponibilidad</label>
                <input
                  type="text"
                  name="disponibilidad"
                  value={formData.disponibilidad}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">URL de la Imagen</label>
                <input
                  type="text"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]"
              >
                {currentMentor ? "Actualizar" : "Guardar"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border">Foto</th>
              <th className="py-2 px-4 border">Nombre</th>
              <th className="py-2 px-4 border">Teléfono</th>
              <th className="py-2 px-4 border">Área</th>
              <th className="py-2 px-4 border">Disponibilidad</th>
              <th className="py-2 px-4 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {mentors.length > 0 ? (
              mentors.map((mentor) => (
                <tr key={mentor.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border">
                    {mentor.image_url ? (
                      <img
                        src={mentor.image_url}
                        alt={mentor.nombre}
                        className="w-12 h-12 object-cover rounded-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://via.placeholder.com/50";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                        {mentor.nombre.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4 border">{mentor.nombre}</td>
                  <td className="py-2 px-4 border">{mentor.telefono}</td>
                  <td className="py-2 px-4 border">{mentor.area_experiencia}</td>
                  <td className="py-2 px-4 border">{mentor.disponibilidad}</td>
                  <td className="py-2 px-4 border">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(mentor)}
                        className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg font-medium cursor-pointer hover:opacity-90"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => openDeleteModal(mentor.id)}
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
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No hay mentores registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMentors;