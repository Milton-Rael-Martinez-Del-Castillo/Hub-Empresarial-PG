const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../src/config/config');

jest.mock('../src/config/database', () => ({ query: jest.fn() }));
const pool = require('../src/config/database');
const app = require('../src/app');

const HASH = bcrypt.hashSync('Univalle1234!', 10);
const ADMIN = { id: 1, nombre: 'Admin', correo: 'admin@univalle.edu', contrasena: HASH, rol: 'Administrador' };

describe('POST /api/hub/login', () => {
  afterEach(() => jest.clearAllMocks());

  it('rechaza la solicitud si faltan correo o contraseña (HTTP 400)', async () => {
    const res = await request(app).post('/api/hub/login').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Correo y contraseña son obligatorios');
  });

  it('niega el acceso si el administrador no existe (HTTP 401)', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    const res = await request(app)
      .post('/api/hub/login')
      .send({ email: 'noexiste@univalle.edu', password: 'Univalle1234!' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Credenciales incorrectas');
  });

  it('niega el acceso si la contraseña es incorrecta (HTTP 401)', async () => {
    pool.query.mockResolvedValueOnce([[ADMIN]]);
    const res = await request(app)
      .post('/api/hub/login')
      .send({ email: 'admin@univalle.edu', password: 'ContrasenaEquivocada1!' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Credenciales incorrectas');
  });

  it('inicia sesión correctamente con credenciales válidas (HTTP 200 + token)', async () => {
    pool.query.mockResolvedValueOnce([[ADMIN]]);
    const res = await request(app)
      .post('/api/hub/login')
      .send({ email: 'admin@univalle.edu', password: 'Univalle1234!' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user.email).toBe('admin@univalle.edu');
    expect(res.body.user).not.toHaveProperty('contrasena');
  });
});

describe('GET /api/hub/verify-auth', () => {
  afterEach(() => jest.clearAllMocks());

  it('responde isAuthenticated=false sin token', async () => {
    const res = await request(app).get('/api/hub/verify-auth');
    expect(res.status).toBe(200);
    expect(res.body.isAuthenticated).toBe(false);
  });

  it('responde isAuthenticated=false con token inválido', async () => {
    const res = await request(app)
      .get('/api/hub/verify-auth')
      .set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(200);
    expect(res.body.isAuthenticated).toBe(false);
  });

  it('responde isAuthenticated=true con los datos del usuario (token válido)', async () => {
    const token = jwt.sign({ id: 1, nombre: 'Admin', correo: 'admin@univalle.edu', rol: 'Administrador' }, config.jwtSecret);
    const res = await request(app)
      .get('/api/hub/verify-auth')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.isAuthenticated).toBe(true);
    expect(res.body.user).toMatchObject({ id: 1, email: 'admin@univalle.edu', rol: 'Administrador' });
  });
});

describe('Acceso a rutas protegidas del Hub', () => {
  afterEach(() => jest.clearAllMocks());

  it('devuelve HTTP 401 si no se envía token', async () => {
    const res = await request(app).get('/api/nae/solicitudes');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Acceso no autorizado. Token no proporcionado.');
  });

  it('devuelve HTTP 401 con token inválido', async () => {
    const res = await request(app)
      .get('/api/nae/solicitudes')
      .set('Authorization', 'Bearer token-invalido');
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token invalido o expirado.');
  });
});