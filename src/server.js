// src/server.js
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');

const quizRouter = require('./routes/quiz');
const sushiRouter = require('./routes/sushi');

const app = express();
const PORT = process.env.PORT || 3000;

// Security + logging middlewares
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(cors());

// Serve static files (images, frontend) from src/public if present
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// API routes
app.use('/api/questions', quizRouter); // GET /api/questions
app.use('/api/sushi', sushiRouter);     // GET /api/sushi, POST /api/result

// Health-check (useful for CI / monitoring)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SushiMatch backend running' });
});

// Generic 404 for unknown API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server only when run directly (ease testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`SushiMatch backend listening: http://localhost:${PORT}`);
  });
}

module.exports = app;
