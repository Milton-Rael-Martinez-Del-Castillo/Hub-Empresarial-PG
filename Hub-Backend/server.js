const app = require('./src/app');
const config = require('./src/config/config');
const dbModel = require('./src/models/dbModel');

const PORT = config.port || 8010;

(async () => {
  try {
    await dbModel.initializeTables();
    app.listen(PORT, () => {
      console.log(`Servidor Hub Empresarial corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error('Error iniciando tablas del Hub:', error);
    process.exit(1);
  }
})();