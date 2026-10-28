import React, { useState } from "react";

const AdminRevenue = ({
  revenueList,
  showForm,
  currentRevenue,
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
  handleEdit,
  handleDelete,
  setFormData, // ✅ Necesario para limpiar el formulario
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [revenueToDelete, setRevenueToDelete] = useState(null);

  const openDeleteModal = (id) => {
    setRevenueToDelete(id);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setRevenueToDelete(null);
  };

  const confirmDelete = () => {
    handleDelete(revenueToDelete);
    closeDeleteModal();
  };

  const handleAddNew = () => {
    handleEdit(null);       // Reset editing
    setFormData({});        // ✅ Limpiar el formulario
    setShowForm(true);      // Mostrar formulario
  };

  const handleCancel = () => {
    setShowForm(false);     // Cierra el formulario
    resetForm();            // Limpia todos los campos
    if (currentRevenue) {
      handleEdit(null);     // Limpia el estado de edición si existe
    }
  };

  const resetForm = () => {
  setFormData({
    imagen_url: "",
    titulo: "",
    subtitulo: "",
    descripcion: "",
    servicios: ""
  });
};

  return (
    <div className="p-4 max-w-full overflow-x-hidden">
      {/* Modal de confirmación */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirmar Eliminación</h3>
            <p className="mb-6">¿Estás seguro de que deseas eliminar este servicio?</p>
            <div className="flex justify-end gap-3">
              <button onClick={closeDeleteModal} className="bg-[#66B5CB] text-white px-4 py-2 rounded-lg">Cancelar</button>
              <button onClick={confirmDelete} className="bg-[#880043] text-white px-4 py-2 rounded-lg">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <button
          onClick={handleAddNew}
          className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]"
        >
          + Añadir Nuevo Servicio
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4">
            {currentRevenue ? "Editar Servicio" : "Crear Nuevo Servicio"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">URL de la Imagen</label>
                <input
                  type="text"
                  name="imagen_url"
                  value={formData.imagen_url || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
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
                <label className="block text-gray-700 mb-2">Subtítulo</label>
                <input
                  type="text"
                  name="subtitulo"
                  value={formData.subtitulo || ""}
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
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Servicios</label>
                <textarea
                  name="servicios"
                  value={formData.servicios || ""}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded"
                  rows="5"
                  placeholder="Servicio 1\nServicio 2\nServicio 3"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Ingresa cada servicio en una línea separada
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]">
                {currentRevenue ? "Actualizar" : "Guardar"}
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

      {/* Tabla de servicios */}
      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white border rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-4 border text-left w-24">Imagen</th>
              <th className="py-3 px-4 border text-left min-w-[150px]">Título</th>
              <th className="py-3 px-4 border text-left min-w-[150px]">Subtítulo</th>
              <th className="py-3 px-4 border text-left min-w-[200px]">Descripción</th>
              <th className="py-3 px-4 border text-left min-w-[200px]">Servicios</th>
              <th className="py-3 px-4 border text-left w-40">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {revenueList.length > 0 ? (
              revenueList.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 border-t">
                  <td className="py-3 px-4">
                    {item.imagen_url ? (
                      <img
                        src={item.imagen_url}
                        
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
                  <td className="py-3 px-4">{item.subtitulo}</td>
                  <td className="py-3 px-4 line-clamp-2" title={item.descripcion}>{item.descripcion}</td>
                  <td className="py-3 px-4">
                    <ul className="list-disc list-inside">
                      {item.servicios.split('\n').filter(s => s.trim()).map((servicio, i) => (
                        <li key={i} className="truncate max-w-xs" title={servicio}>{servicio}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2 flex-wrap">
                      <button onClick={() => handleEdit(item)} className="bg-[#66B5CB] text-white px-3 py-1 rounded-lg text-sm">
                        Editar
                      </button>
                      <button onClick={() => openDeleteModal(item.id)} className="bg-[#880043] text-white px-3 py-1 rounded-lg text-sm">
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">
                  No hay servicios registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRevenue;
