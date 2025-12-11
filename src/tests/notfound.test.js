const request = require('supertest');
const app = require('../server');

describe('Unknown API routes', () => {
  test('should return 404 for unknown API route', async () => {
    const res = await request(app).get('/api/unknown-route');

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error', 'API route not found');
  });
});
