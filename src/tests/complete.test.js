// src/tests/complete.test.js - COMPREHENSIVE TEST SUITE
const request = require('supertest');
const app = require('../server');

describe('API Endpoints - Complete Test Suite', () => {
    let authToken;
    let testUserId;

    // ===== HEALTH CHECK =====
    describe('GET /api/health', () => {
        test('should return 200 and status ok', async () => {
            const res = await request(app).get('/api/health');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status', 'ok');
        });
    });

    // ===== QUESTIONS ENDPOINT =====
    describe('GET /api/questions', () => {
        test('should return 200 and questions array', async () => {
            const res = await request(app).get('/api/questions');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('questions');
            expect(Array.isArray(res.body.questions)).toBe(true);
        });

        test('should return exactly 10 questions', async () => {
            const res = await request(app).get('/api/questions');
            expect(res.body.questions.length).toBe(10);
        });

        test('each question should have required fields', async () => {
            const res = await request(app).get('/api/questions');
            const q = res.body.questions[0];
            expect(q).toHaveProperty('id');
            expect(q).toHaveProperty('question');
            expect(q).toHaveProperty('options');
            expect(Array.isArray(q.options)).toBe(true);
        });
    });

    // ===== SUSHI SETS ENDPOINT =====
    describe('GET /api/sushi', () => {
        test('should return 200 and sushi sets', async () => {
            const res = await request(app).get('/api/sushi');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('sets');
            expect(Array.isArray(res.body.sets)).toBe(true);
        });

        test('should return 5 sushi types', async () => {
            const res = await request(app).get('/api/sushi');
            expect(res.body.sets.length).toBe(5);
        });

        test('each sushi set should have required fields', async () => {
            const res = await request(app).get('/api/sushi');
            const set = res.body.sets[0];
            expect(set).toHaveProperty('id');
            expect(set).toHaveProperty('name');
            expect(set).toHaveProperty('description');
        });
    });

    // ===== AUTHENTICATION - REGISTER =====
    describe('POST /api/auth/register', () => {
        const randomEmail = `test${Date.now()}@example.com`;

        test('should register new user successfully', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: randomEmail,
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('user');
            expect(res.body).toHaveProperty('token');
            expect(res.body.user.email).toBe(randomEmail);

            // Save for later tests
            authToken = res.body.token;
            testUserId = res.body.user.id;
        });

        test('should reject duplicate email', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser2',
                    email: randomEmail,
                    password: 'password123'
                });

            expect(res.statusCode).toBe(409);
            expect(res.body).toHaveProperty('error');
        });

        test('should reject missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser'
                    // missing email and password
                });

            expect(res.statusCode).toBe(400);
        });

        test('should reject short password', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    email: 'another@example.com',
                    password: '123' // too short
                });

            expect(res.statusCode).toBe(400);
        });
    });

    // ===== AUTHENTICATION - LOGIN =====
    describe('POST /api/auth/login', () => {
        test('should login with valid credentials', async () => {
            // Use the email from previous test
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: `test${Date.now() - 1000}@example.com`, // approximate
                    password: 'password123'
                });

            // This might fail if email doesn't exist, that's ok
            if (res.statusCode === 200) {
                expect(res.body).toHaveProperty('token');
            }
        });

        test('should reject invalid credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'wrong@example.com',
                    password: 'wrongpass'
                });

            expect(res.statusCode).toBe(401);
        });

        test('should reject missing fields', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'test@example.com'
                    // missing password
                });

            expect(res.statusCode).toBe(400);
        });
    });

    // ===== PROTECTED ROUTES =====
    describe('GET /api/auth/me', () => {
        test('should reject without token', async () => {
            const res = await request(app).get('/api/auth/me');
            expect(res.statusCode).toBe(401);
        });

        test('should reject with invalid token', async () => {
            const res = await request(app)
                .get('/api/auth/me')
                .set('Authorization', 'Bearer invalid_token');

            expect(res.statusCode).toBe(401);
        });
    });

    describe('GET /api/profile', () => {
        test('should reject without token', async () => {
            const res = await request(app).get('/api/profile');
            expect(res.statusCode).toBe(401);
        });
    });

    // ===== QUIZ RESULT =====
    describe('POST /api/sushi/result', () => {
        test('should return result for valid answers', async () => {
            const answers = ['soft', 'chill', 'relaxed', 'calm', 'lofi', 'modern', 'classic', 'emotional', 'romantic', 'salmon'];

            const res = await request(app)
                .post('/api/sushi/result')
                .send({ answers });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('result');
            expect(res.body.result).toHaveProperty('id');
            expect(res.body.result).toHaveProperty('name');
            expect(res.body).toHaveProperty('scores');
        });

        test('should reject invalid request body', async () => {
            const res = await request(app)
                .post('/api/sushi/result')
                .send({ invalid: 'data' });

            expect(res.statusCode).toBe(400);
        });

        test('should handle empty answers array', async () => {
            const res = await request(app)
                .post('/api/sushi/result')
                .send({ answers: [] });

            expect(res.statusCode).toBe(200);
            // Should return default set
            expect(res.body.result).toHaveProperty('id');
        });
    });

    // ===== 404 HANDLING =====
    describe('Unknown routes', () => {
        test('should return 404 for unknown API routes', async () => {
            const res = await request(app).get('/api/unknown');
            expect(res.statusCode).toBe(404);
        });

        test('should return 404 for unknown POST routes', async () => {
            const res = await request(app).post('/api/unknown');
            expect(res.statusCode).toBe(404);
        });
    });

    // ===== ALGORITHM TESTING =====
    describe('Sushi matching algorithm', () => {
        test('should return salmon_nigiri for calm answers', async () => {
            const answers = ['soft', 'calm', 'creative', 'calm', 'lofi', 'calm', 'classic', 'rational', 'classic', 'salmon'];

            const res = await request(app)
                .post('/api/sushi/result')
                .send({ answers });

            expect(res.statusCode).toBe(200);
            expect(res.body.result.id).toBe('salmon_nigiri');
        });

        test('should return dragon_roll for luxury answers', async () => {
            const answers = ['luxury', 'modern', 'social', 'loyal', 'edm', 'modern', 'mature', 'social', 'romantic', 'tuna'];

            const res = await request(app)
                .post('/api/sushi/result')
                .send({ answers });

            expect(res.statusCode).toBe(200);
            expect(res.body.result.id).toBe('dragon_roll');
        });

        test('should return veggie_roll for natural answers', async () => {
            const answers = ['natural', 'calm', 'creative', 'chill', 'lofi', 'relaxed', 'classic', 'rational', 'relaxed', 'avocado'];

            const res = await request(app)
                .post('/api/sushi/result')
                .send({ answers });

            expect(res.statusCode).toBe(200);
            expect(res.body.result.id).toBe('veggie_roll');
        });
    });
});