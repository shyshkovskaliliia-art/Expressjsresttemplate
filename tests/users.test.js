const request = require('supertest');
const app = require('../app');
const db = require('../config/database');

// Mock database for testing
jest.mock('../config/database', () => ({
  query: jest.fn(),
}));

describe('GET /api/teachers', () => {
  it('should return all teachers', async () => {
    const mockTeachers = [
      { teacher_id: 1, full_name: 'John Doe', phone: '123', address: 'Kyiv', birth_date: '1990-01-01', start_date: '2020-09-01' }
    ];
    db.query.mockResolvedValueOnce([mockTeachers]);
    
    const res = await request(app).get('/api/teachers');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(1);
  });
});

describe('POST /api/teachers', () => {
  it('should create a new teacher', async () => {
    const newTeacher = { full_name: 'Jane Smith', start_date: '2024-01-01' };
    db.query.mockResolvedValueOnce([{ insertId: 2 }]);
    
    const res = await request(app)
      .post('/api/teachers')
      .send(newTeacher)
      .set('Content-Type', 'application/json');
      
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.teacher_id).toBe(2);
  });
});

describe('DELETE /api/teachers/:id', () => {
  it('should delete existing teacher', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    
    const res = await request(app).delete('/api/teachers/1');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
  
  it('should return 404 for non-existing teacher', async () => {
    db.query.mockResolvedValueOnce([{ affectedRows: 0 }]);
    
    const res = await request(app).delete('/api/teachers/999');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });
});