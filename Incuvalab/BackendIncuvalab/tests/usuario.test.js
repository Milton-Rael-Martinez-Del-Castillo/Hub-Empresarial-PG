const request = require('supertest');
const bcrypt = require('bcryptjs');

jest.mock('../src/config/database', () => ({ getConnection: jest.fn() }));
const pool = require('../src/config/database');
const app = require('../src/app');

const mockConnection = () => {
  const connection = { execute: jest.fn(), release: jest.fn() };
  pool.getConnection.mockResolvedValue(connection);
  return connection;
};

describe('POST /api/usuario — registro de usuario', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => jest.restoreAllMocks());
  const VALID = { email: 'nuevo@example.com', password: 'Clave123!', rol: 'Emprendedor' };

  it('rechaza el registro con campos vacíos (HTTP 400) sin tocar la BD', async () => {
    const res = await request(app).post('/api/usuario').send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Todos los campos son obligatorios');
    expect(pool.getConnection).not.toHaveBeenCalled();
  });

  it.each(['correo-invalido', 'a@b'])('rechaza el correo "%s" (HTTP 400)', async (email) => {
    const res = await request(app).post('/api/usuario').send({ ...VALID, email });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Por favor ingresa un correo electrónico válido');
    expect(pool.getConnection).not.toHaveBeenCalled();
  });

  it('rechaza una contraseña débil indicando los requisitos (HTTP 400)', async () => {
    const res = await request(app)
      .post('/api/usuario')
      .send({ ...VALID, password: 'corta' });
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('La contraseña debe contener');
    expect(pool.getConnection).not.toHaveBeenCalled();
  });

  it('rechaza el rol Administrador (HTTP 400)', async () => {
    const res = await request(app).post('/api/usuario').send({ ...VALID, rol: 'Administrador' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('El rol seleccionado no es válido');
    expect(pool.getConnection).not.toHaveBeenCalled();
  });

  it('rechaza el rol Mentor (HTTP 400): rol privilegiado no registrable', async () => {
    const res = await request(app).post('/api/usuario').send({ ...VALID, rol: 'Mentor' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('El rol seleccionado no es válido');
    expect(pool.getConnection).not.toHaveBeenCalled();
  });

  it.each(['Emprendedor', 'Estudiante', 'Institución'])(
    'permite registrar el rol %s (HTTP 200)',
    async (rol) => {
      const connection = mockConnection();
      connection.execute.mockResolvedValueOnce([{ affectedRows: 1, insertId: 9 }]);
      const res = await request(app).post('/api/usuario').send({ ...VALID, rol });
      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Usuario registrado exitosamente');
      expect(connection.execute).toHaveBeenCalledTimes(1);
      const [sql, params] = connection.execute.mock.calls[0];
      expect(sql).toContain('INSERT INTO usuario');
      expect(params[0]).toBe(VALID.email);
      expect(params[1]).not.toBe(VALID.password);
      expect(await bcrypt.compare(VALID.password, params[1])).toBe(true);
      expect(params[2]).toBe(rol);
    }
  );

  it('rechaza un correo ya registrado (HTTP 400)', async () => {
    const connection = mockConnection();
    connection.execute.mockRejectedValueOnce({ code: 'ER_DUP_ENTRY' });
    const res = await request(app).post('/api/usuario').send(VALID);
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('El correo ya se encuentra registrado');
  });
});