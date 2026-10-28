const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => res.status(200).send('Hub Empresarial API Running'));
app.use('/api', routes);

// Manejo de errores
app.use(errorHandler);

module.exports = app;