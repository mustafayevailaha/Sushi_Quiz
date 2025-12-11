// src/routes/sushi.js
const express = require('express');
const router = express.Router();
const sushiLogic = require('../utils/sushiLogic');

/*
  GET /
    Returns the list of sushi sets (id, name, image, description).
*/
router.get('/', (req, res) => {
  try {
    const sets = sushiLogic.getSushiSets();
    res.json({ count: sets.length, sets });
  } catch (err) {
    console.error('GET /api/sushi error:', err);
    res.status(500).json({ error: 'Failed to load sushi sets' });
  }
});

/*
  POST /result
    Body: { answers: [ "valueA", "valueB", ... ] } OR
          { answers: [ { questionId: 1, value: "valueA" }, ... ] }
    Response: { result: <sushiSet>, scores: { sushiId: score }, winners: [...], topScore }
*/
router.post('/result', (req, res) => {
  try {
    const { answers } = req.body;
    if (!Array.isArray(answers)) {
      return res.status(400).json({ error: 'Missing or invalid "answers" array in request body' });
    }
    const outcome = sushiLogic.computeResult(answers);
    return res.json({ result: outcome.resultSet, scores: outcome.scores, winners: outcome.winners, topScore: outcome.topScore });
  } catch (err) {
    console.error('POST /api/sushi/result error:', err);
    return res.status(500).json({ error: 'Failed to compute result' });
  }
});

module.exports = router;
