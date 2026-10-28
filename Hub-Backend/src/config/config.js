require('dotenv').config();

module.exports = {
  port: process.env.PORT || 8083,
  jwtSecret: process.env.JWT_SECRET || 'tu_clave_secreta_fuerte_para_desarrollo_123',
  db: {
    server: process.env.DB_SERVER,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_DATABASE
  },
  externos: {
    incuvalabApi: process.env.INCUVALAB_API_URL || 'http://localhost:8000/api',
    crowdfundingApi: process.env.CROWDFUNDING_API_URL || 'http://localhost:4001/api'
  }
};