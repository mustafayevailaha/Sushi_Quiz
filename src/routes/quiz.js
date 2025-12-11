// src/routes/quiz.js
const express = require('express');
const router = express.Router();
const sushiLogic = require('../utils/sushiLogic');

/*
  GET /
    Returns sanitized questions: does NOT include internal "votes" mapping
    Frontend: fetch('/api/questions') to get questions
*/
router.get('/', (req, res) => {
  try {
    const questions = sushiLogic.getSanitizedQuestions();
    // Optionally shuffle or limit questions here; we return full set
    res.json({ count: questions.length, questions });
  } catch (err) {
    console.error('GET /api/questions error:', err);
    res.status(500).json({ error: 'Failed to load questions' });
  }
});

module.exports = router;
