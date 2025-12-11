// src/tests/questions.test.js
const request = require('supertest');
const app = require('../server'); // correct relative path

describe('GET /api/questions', () => {
  test('should return a JSON object with count and questions[] array', async () => {
    const res = await request(app).get('/api/questions');

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty('count');
    expect(res.body).toHaveProperty('questions');
    expect(Array.isArray(res.body.questions)).toBe(true);

    if (res.body.questions.length > 0) {
      expect(res.body.questions[0]).toHaveProperty('question');
      expect(res.body.questions[0]).toHaveProperty('options');
    }
  });
});
