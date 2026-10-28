const naeModel = require('../models/naeModel');

// Publico: registrar una solicitud de asesoria NAE
const submitSolicitud = async (req, res, next) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ message: 'El nombre y el correo son obligatorios' });
  }

  try {
    const id = await naeModel.create({ nombre, correo });
    res.status(201).json({ success: true, message: 'Solicitud enviada correctamente', id });
  } catch (error) {
    next(error);
  }
};

// Admin: listar solicitudes NAE
const getSolicitudes = async (req, res, next) => {
  try {
    const data = await naeModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Admin: eliminar una solicitud NAE
const deleteSolicitud = async (req, res, next) => {
  try {
    const deleted = await naeModel.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
    }

    res.status(200).json({ success: true, message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

// ─── Casos de exito NAE (carrusel editable) ───

// Publico: listar casos de exito
const getCasos = async (req, res, next) => {
  try {
    const data = await naeModel.getCases();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Admin: crear un caso de exito
const createCaso = async (req, res, next) => {
  const { titulo, descripcion, imagen_url, orden } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ message: 'El título y la descripción son obligatorios' });
  }

  try {
    const id = await naeModel.createCase({ titulo, descripcion, imagen_url, orden });
    res.status(201).json({ success: true, message: 'Caso creado correctamente', id });
  } catch (error) {
    next(error);
  }
};

// Admin: actualizar un caso de exito
const updateCaso = async (req, res, next) => {
  const { titulo, descripcion, imagen_url, orden } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ message: 'El título y la descripción son obligatorios' });
  }

  try {
    const updated = await naeModel.updateCase(req.params.id, { titulo, descripcion, imagen_url, orden });

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Caso no encontrado' });
    }

    res.status(200).json({ success: true, message: 'Caso actualizado correctamente' });
  } catch (error) {
    next(error);
  }
};

// Admin: eliminar un caso de exito
const deleteCaso = async (req, res, next) => {
  try {
    const deleted = await naeModel.removeCase(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Caso no encontrado' });
    }

    res.status(200).json({ success: true, message: 'Caso eliminado correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitSolicitud,
  getSolicitudes,
  deleteSolicitud,
  getCasos,
  createCaso,
  updateCaso,
  deleteCaso
};