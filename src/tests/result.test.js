const request = require('supertest');
const app = require('../server');

describe('POST /api/sushi/result', () => {
  test('should accept answers and return a result', async () => {
    const payload = { answers: ['opt1', 'opt2'] }; // example answers

    const res = await request(app)
      .post('/api/sushi/result')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('result');
    expect(res.body.result).toHaveProperty('name');
    expect(res.body.result).toHaveProperty('image');
    expect(res.body.result).toHaveProperty('description');
  });
});
