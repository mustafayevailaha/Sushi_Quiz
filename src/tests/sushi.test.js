// src/tests/sushi.test.js
const request = require('supertest');
const app = require('../server'); 

describe('GET /api/sushi', () => {
  test('should return JSON with sushi sets', async () => {
    const res = await request(app).get('/api/sushi');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sets');
    expect(Array.isArray(res.body.sets)).toBe(true);
  });
});
