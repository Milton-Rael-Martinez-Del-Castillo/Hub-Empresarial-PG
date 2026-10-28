const request = require('supertest');
const jwt = require('jsonwebtoken');
const SECRET = 'tu_clave_secreta_fuerte_para_desarrollo_123';

jest.mock('../src/config/database', () => ({ getConnection: jest.fn() }));
jest.mock('../src/models/moocModel', () => ({
  initializeTables: jest.fn(),
  createCourse: jest.fn(),
  getCoursesByMentorId: jest.fn()
}));

const moocModel = require('../src/models/moocModel');
const app = require('../src/app');

const mentorToken = jwt.sign({ id: 7, email: 'mentor@example.com', rol: 'Mentor' }, SECRET);
const emprendedorToken = jwt.sign({ id: 8, email: 'em@example.com', rol: 'Emprendedor' }, SECRET);

const cursoValido = {
  title: 'Curso Intro',
  provider: 'Univalle',
  image_url: 'https://x.com/i.png',
  logo_url: 'https://x.com/l.png',
  type: 'online',
  category: 'Tecnología',
  slide: [{ title: 'S1', content: 'c' }]
};

describe('POST /api/moocs/courses — control de rol Mentor', () => {
  afterEach(() => jest.clearAllMocks());

  it('devuelve HTTP 401 si no se envía token', async () => {
    const res = await request(app).post('/api/moocs/courses').send(cursoValido);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Token requerido');
  });

  it('devuelve HTTP 403 si el rol no es Mentor (Emprendedor)', async () => {
    const res = await request(app)
      .post('/api/moocs/courses')
      .set('Authorization', `Bearer ${emprendedorToken}`)
      .send(cursoValido);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe('Solo los mentores pueden acceder a esta función');
    expect(moocModel.createCourse).not.toHaveBeenCalled();
  });

  it('permite a un Mentor crear el curso (HTTP 201)', async () => {
    moocModel.createCourse.mockResolvedValueOnce(12);
    const res = await request(app)
      .post('/api/moocs/courses')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send(cursoValido);
    expect(res.status).toBe(201);
    expect(res.body.data.id).toBe(12);
    expect(moocModel.createCourse).toHaveBeenCalledWith(expect.objectContaining({ mentor_id: 7 }));
  });

  it('devuelve HTTP 400 si faltan campos obligatorios (Mentor con token válido)', async () => {
    const res = await request(app)
      .post('/api/moocs/courses')
      .set('Authorization', `Bearer ${mentorToken}`)
      .send({ title: 'Solo título' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('El campo provider es obligatorio');
  });
});

describe('GET /api/moocs/my-courses — control de rol Mentor', () => {
  afterEach(() => jest.clearAllMocks());

  it('devuelve HTTP 401 sin token', async () => {
    const res = await request(app).get('/api/moocs/my-courses');
    expect(res.status).toBe(401);
  });

  it('devuelve HTTP 403 con rol no Mentor', async () => {
    const res = await request(app)
      .get('/api/moocs/my-courses')
      .set('Authorization', `Bearer ${emprendedorToken}`);
    expect(res.status).toBe(403);
  });

  it('devuelve los cursos del mentor autenticado (HTTP 200)', async () => {
    moocModel.getCoursesByMentorId.mockResolvedValueOnce([{ id: 1, title: 'Curso A' }]);
    const res = await request(app)
      .get('/api/moocs/my-courses')
      .set('Authorization', `Bearer ${mentorToken}`);
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(moocModel.getCoursesByMentorId).toHaveBeenCalledWith(7);
  });
});