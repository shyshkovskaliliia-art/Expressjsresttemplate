// tests/teachers.test.js
const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

jest.mock('../config/database', () => ({ query: jest.fn() }));

describe('Teachers API', () => {
  beforeEach(() => jest.clearAllMocks());
  
  test('GET /api/teachers returns all teachers', async () => {
    db.query.mockResolvedValueOnce([[{ teacher_id: 1, full_name: 'Test' }]]);
    const res = await request(app).get('/api/teachers');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
  
  test('POST /api/teachers creates new teacher', async () => {
    db.query.mockResolvedValueOnce([{ insertId: 2 }]);
    const res = await request(app)
      .post('/api/teachers')
      .send({ full_name: 'New', start_date: '2024-01-01' });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });
  
  test('DELETE /api/teachers/:id removes teacher', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    const res = await request(app).delete('/api/teachers/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});