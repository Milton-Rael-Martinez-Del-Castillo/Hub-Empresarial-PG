const umaModel = require('../models/umaModel');

// Publico: registrar una solicitud UMA
const submitSolicitud = async (req, res, next) => {
  const { nombre, correo, mensaje } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ message: 'El nombre y el correo son obligatorios' });
  }

  try {
    const id = await umaModel.create({ nombre, correo, mensaje });
    res.status(201).json({ success: true, message: 'Solicitud enviada correctamente', id });
  } catch (error) {
    next(error);
  }
};

// Admin: listar solicitudes UMA
const getSolicitudes = async (req, res, next) => {
  try {
    const data = await umaModel.getAll();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// Admin: eliminar una solicitud UMA
const deleteSolicitud = async (req, res, next) => {
  try {
    const deleted = await umaModel.remove(req.params.id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Solicitud no encontrada' });
    }

    res.status(200).json({ success: true, message: 'Solicitud eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitSolicitud,
  getSolicitudes,
  deleteSolicitud
};