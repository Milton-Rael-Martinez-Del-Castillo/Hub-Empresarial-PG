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

describe('Solicitudes de asesoría NAE', () => {
  afterEach(() => jest.clearAllMocks());

  it('rechaza la solicitud si falta el nombre o el correo (HTTP 400)', async () => {
    const res = await request(app)
      .post('/api/nae/solicitudes')
      .send({ nombre: 'Juan' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('El nombre y el correo son obligatorios');
  });

  it('registra una solicitud válida (HTTP 201)', async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 10 }]);
    const res = await request(app)
      .post('/api/nae/solicitudes')
      .send({ nombre: 'Juan Pérez', correo: 'juan@example.com' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.id).toBe(10);
  });

  it('niega el listado de solicitudes sin token (HTTP 401)', async () => {
    const res = await request(app).get('/api/nae/solicitudes');
    expect(res.status).toBe(401);
  });

  it('lista solicitudes con token válido (HTTP 200)', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, nombre: 'Juan', correo: 'juan@example.com' }]]);
    const res = await request(app)
      .get('/api/nae/solicitudes')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('retorna HTTP 404 al eliminar una solicitud inexistente', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app)
      .delete('/api/nae/solicitudes/999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Solicitud no encontrada');
  });

  it('elimina una solicitud existente (HTTP 200)', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app)
      .delete('/api/nae/solicitudes/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Solicitud eliminada correctamente');
  });
});

describe('Casos de éxito NAE (carrusel)', () => {
  afterEach(() => jest.clearAllMocks());

  it('lista los casos de éxito de forma pública (HTTP 200)', async () => {
    pool.query.mockResolvedValueOnce([
      [{ id: 1, titulo: 'Proyecto Destacado 1', descripcion: 'Descripción', orden: 1 }]
    ]);
    const res = await request(app).get('/api/nae/casos');
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it('rechaza crear un caso sin título o descripción (HTTP 400)', async () => {
    const res = await request(app)
      .post('/api/nae/casos')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Solo título' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('El título y la descripción son obligatorios');
  });

  it('crea un caso de éxito (HTTP 201)', async () => {
    pool.query.mockResolvedValueOnce([{ insertId: 5 }]);
    const res = await request(app)
      .post('/api/nae/casos')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'Nuevo caso', descripcion: 'Descripción', orden: '3' });
    expect(res.status).toBe(201);
    expect(res.body.id).toBe(5);
  });

  it('retorna HTTP 404 al editar un caso inexistente', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app)
      .put('/api/nae/casos/999')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'T', descripcion: 'D' });
    expect(res.status).toBe(404);
  });

  it('edita un caso existente (HTTP 200)', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app)
      .put('/api/nae/casos/1')
      .set('Authorization', `Bearer ${token}`)
      .send({ titulo: 'T', descripcion: 'D' });
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Caso actualizado correctamente');
  });

  it('retorna HTTP 404 al eliminar un caso inexistente', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    const res = await request(app)
      .delete('/api/nae/casos/999')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('elimina un caso existente (HTTP 200)', async () => {
    pool.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app)
      .delete('/api/nae/casos/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Caso eliminado correctamente');
  });
});