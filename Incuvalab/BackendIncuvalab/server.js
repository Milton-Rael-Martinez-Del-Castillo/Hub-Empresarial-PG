const app = require('./src/app');
const config = require('./src/config/config');
const moocModel = require('./src/models/moocModel');

const PORT = config.port || 8000;

(async () => {
  try {
    await moocModel.initializeTables();
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando tablas MOOC:', error);
    process.exit(1);
  }
})();
