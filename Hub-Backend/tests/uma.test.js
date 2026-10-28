const request = require('supertest');
const jwt = require('jsonwebtoken');
const config = require('../src/config/config');

jest.mock('../src/config/database', () => ({ query: jest.fn() }));
const pool = require('../src/config/database');
const app = require('../src/app');

const token = jwt.sign(
  { id: 1, nombre: 'Admin', correo: 'admin@univalle.edu', rol: 'Administrador' },
  config.jwtSecret
);

describe('Solicitudes de contacto UMA', () => {
  afterEach(() => jest.clearAllMocks());

  it('rechaza la solicitud si falta el nombre o el correo (HTTP 400)', async () => {
    const res = await request(app)
      .post('/api/uma/solicitudes')
      .send({ correo: 'x@example.com' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('El nombre y el correo son obligatorios');
  });

  it('registra una solicitud válida con mensaje (HTTP 201)', async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 3 }]);
    const res = await request(app)
      .post('/api/uma/solicitudes')
      .send({ nombre: 'María', correo: 'maria@example.com', mensaje: 'Necesito un desarrollo' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(3);
  });

  it('niega el listado de solicitudes sin token (HTTP 401)', async () => {
    const res = await request(app).get('/api/uma/solicitudes');
    expect(res.status).toBe(401);
  });

  it('lista solicitudes con token válido (HTTP 200)', async () => {
    pool.query.mockResolvedValueOnce([
      [{ id: 1, nombre: 'María', correo: 'maria@example.com', mensaje: 'hola' }]
    ]);
    const res = await request(app)
      .get('/api/uma/solicitudes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('retorna HTTP 404 al eliminar una solicitud inexistente', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app)
      .delete('/api/uma/solicitudes/999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Solicitud no encontrada');
  });
});