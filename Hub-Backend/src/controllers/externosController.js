const config = require('../config/config');

// Incluye la respuesta de la API externa en el formato correcto.
const normalizar = (data) => {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  return [];
};

// Consulta solo-lectura a un backend externo (misma red docker)
const consultarExterno = async (baseUrl, path) => {
  const response = await fetch(`${baseUrl}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} en ${baseUrl}${path}`);
  }
  return response.json();
};

// Incuvalab: lista de mentores (solo lectura, sin edicion)
const listarMentores = async (req, res) => {
  try {
    const data = await consultarExterno(config.externos.incuvalabApi, '/mentor');
    res.json(normalizar(data));
  } catch (err) {
    console.error('Error consultando mentores (incuvalab):', err);
    res.status(502).json({ message: 'No se pudieron obtener los mentores de Incuvalab' });
  }
};

// Crowdfunding: lista de proyectos aprobados/activos (solo lectura)
const listarProyectosCrowdfunding = async (req, res) => {
  try {
    const data = await consultarExterno(config.externos.crowdfundingApi, '/proyectos/todos');
    const proyectos = normalizar(data).map((p) => ({
      IdProyecto: p.IdProyecto,
      Titulo: p.Titulo || p.Nombre || '',
      Categoria: p.Categoria,
      DescripcionCorta: p.DescripcionCorta,
      ImagenPrincipal: p.ImagenPrincipal,
      EstadoAprobacion: p.EstadoAprobacion,
      NombreCreador: p.NombreCreador,
      ApellidoCreador: p.ApellidoCreador
    }));
    res.json(proyectos);
  } catch (err) {
    console.error('Error consultando proyectos (crowdfunding):', err);
    res.status(502).json({ message: 'No se pudieron obtener los proyectos de Crowdfunding' });
  }
};

module.exports = {
  listarMentores,
  listarProyectosCrowdfunding
};