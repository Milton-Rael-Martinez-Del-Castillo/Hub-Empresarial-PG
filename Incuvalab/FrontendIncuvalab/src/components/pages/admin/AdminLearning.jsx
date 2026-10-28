import React from "react";

const AdminLearning = ({
  learningList,
  showForm,
  currentLearning,
  formData,
  handleInputChange,
  handleSubmit,
  setShowForm,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#8B0D37]">Gestión de MOOCs</h2>
        <button
          onClick={() => {
            setShowForm(true);
            if (currentLearning) currentLearning(null);
          }}
          className="bg-[#8B0D37] text-white px-4 py-2 rounded hover:bg-[#6d0a2b]"
        >
          Añadir MOOC
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-medium mb-4">
            {currentLearning ? "Editar MOOC" : "Añadir Nuevo MOOC"}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Input fields */}
              {[
                ["Título", "title"],
                ["Proveedor", "provider"],
                ["URL de Imagen", "image_url"],
                ["URL de Logo", "logo_url"],
                ["Tipo", "type"],
                ["Categoría", "category"],
              ].map(([label, name]) => (
                <div key={name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="text"
                    name={name}
                    value={formData[name] || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required={name !== "course_count"}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteo de Cursos
                </label>
                <input
                  type="number"
                  name="course_count"
                  value={formData.course_count || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>

              {/* Checkbox fields */}
              <div className="col-span-2 grid grid-cols-3 gap-4">
                {[
                  ["Popular", "is_popular"],
                  ["Nuevo", "is_new"],
                  ["Tendencia", "is_trending"],
                ].map(([label, name]) => (
                  <div key={name} className="flex items-center">
                    <input
                      type="checkbox"
                      name={name}
                      checked={formData[name] || false}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[#8B0D37] focus:ring-[#8B0D37] border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#8B0D37] text-white rounded hover:bg-[#6d0a2b]"
              >
                {currentLearning ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                "Título",
                "Proveedor",
                "Categoría",
                "Tipo",
                "Cursos",
                "Logo",
                "Imagen",
                "Estado",
                "Acciones",
              ].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {learningList && learningList.length > 0 ? (
              learningList.map((mooc) => (
                <tr key={mooc.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {mooc.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mooc.provider}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mooc.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mooc.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {mooc.course_count || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {mooc.logo_url ? (
                      <img
                        src={mooc.logo_url}
                        alt="Logo"
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {mooc.image_url ? (
                      <img
                        src={mooc.image_url}
                        alt="Course"
                        className="h-10 w-10 object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-1">
                      {mooc.is_popular && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Popular
                        </span>
                      )}
                      {mooc.is_new && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Nuevo
                        </span>
                      )}
                      {mooc.is_trending && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          Tendencia
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(mooc)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(mooc.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="px-6 py-4 text-center text-sm text-gray-500"
                >
                  No hay MOOCs disponibles
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLearning;