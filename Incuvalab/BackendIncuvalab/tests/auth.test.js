const request = require('supertest');
const jwt = require('jsonwebtoken');
const SECRET = 'tu_clave_secreta_fuerte_para_desarrollo_123';

jest.mock('../src/config/database', () => ({ getConnection: jest.fn() }));
const pool = require('../src/config/database');
const app = require('../src/app');

const mockConnection = () => {
  const connection = { execute: jest.fn(), release: jest.fn() };
  pool.getConnection.mockResolvedValue(connection);
  return connection;
};

describe('POST /api/login', () => {
  afterEach(() => jest.clearAllMocks());

  it('niega el acceso con credenciales incorrectas por usuario inexistente (HTTP 401)', async () => {
    const connection = mockConnection();
    connection.execute.mockResolvedValueOnce([[]]);
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'noexiste@example.com', password: 'Clave123!' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Credenciales incorrectas');
  });

  it('niega el acceso con contraseña incorrecta (HTTP 401)', async () => {
    const connection = mockConnection();
    connection.execute.mockResolvedValueOnce([
      [{ id: 1, usuario: 'est@example.com', contrasena: 'hash-no-matching', rol: 'Estudiante' }]
    ]);
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'est@example.com', password: 'ClaveEquivocada1!' });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Credenciales incorrectas');
  });

  it('inicia sesión correctamente y emite token con rol (HTTP 200)', async () => {
    const bcrypt = require('bcryptjs');
    const connection = mockConnection();
    connection.execute.mockResolvedValueOnce([
      [
        {
          id: 1,
          usuario: 'est@example.com',
          contrasena: bcrypt.hashSync('Clave123!', 10),
          rol: 'Estudiante'
        }
      ]
    ]);
    const res = await request(app)
      .post('/api/login')
      .send({ email: 'est@example.com', password: 'Clave123!' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(res.body.user).toMatchObject({ id: 1, email: 'est@example.com', rol: 'Estudiante' });
  });
});

describe('GET /api/verify-auth', () => {
  afterEach(() => jest.clearAllMocks());

  it('responde isAuthenticated=false sin token', async () => {
    const res = await request(app).get('/api/verify-auth');
    expect(res.status).toBe(200);
    expect(res.body.isAuthenticated).toBe(false);
  });

  it('responde isAuthenticated=false con token inválido', async () => {
    const res = await request(app).get('/api/verify-auth').set('Authorization', 'Bearer invalido');
    expect(res.body.isAuthenticated).toBe(false);
  });

  it('responde isAuthenticated=true con el usuario y su rol (token válido)', async () => {
    const token = jwt.sign(
      { id: 1, email: 'admin@example.com', rol: 'Administrador' },
      SECRET
    );
    const res = await request(app).get('/api/verify-auth').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      isAuthenticated: true,
      user: { id: 1, email: 'admin@example.com', rol: 'Administrador' }
    });
  });
});

describe('POST /api/reset-password', () => {
  afterEach(() => jest.clearAllMocks());

  it('rechaza una nueva contraseña con menos de 8 caracteres (HTTP 400)', async () => {
    const res = await request(app)
      .post('/api/reset-password')
      .send({ email: 'est@example.com', newPassword: 'Corta1' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('La contraseña debe tener al menos 8 caracteres');
  });
});