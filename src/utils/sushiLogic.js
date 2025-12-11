// src/utils/sushiLogic.js
const fs = require('fs');
const path = require('path');

const QUESTIONS_FILE = path.join(__dirname, '..', 'data', 'questions.json');
const SUSHI_FILE = path.join(__dirname, '..', 'data', 'sushiSets.json');
const MAPPING_FILE = path.join(__dirname, '..', 'data', 'mapping.json');

let internalQuestions = [];
let sushiSets = [];
let mapping = null;

function loadData() {
  try {
    const qRaw = fs.readFileSync(QUESTIONS_FILE, 'utf8');
    const sRaw = fs.readFileSync(SUSHI_FILE, 'utf8');
    const mRaw = fs.readFileSync(MAPPING_FILE, 'utf8');

    internalQuestions = JSON.parse(qRaw);
    sushiSets = JSON.parse(sRaw);
    mapping = JSON.parse(mRaw);

    // Sanity checks
    if (!mapping || !Array.isArray(mapping.categories)) {
      throw new Error('mapping.json missing categories array');
    }
  } catch (err) {
    console.error('sushiLogic.loadData failed:', err);
    throw err;
  }
}
loadData();

/**
 * Return sanitized questions for client consumption.
 * Removes internal "votes" arrays but keeps option.value, label, image.
 */
function getSanitizedQuestions() {
  return internalQuestions.map((q) => {
    const safeOptions = (q.options || []).map((opt, idx) => ({
      id: `${q.id}-${idx}`,
      label: opt.label,
      image: opt.image,
      value: opt.value || null
    }));
    return {
      id: q.id,
      question: q.question,
      type: q.type || 'single-choice',
      options: safeOptions
    };
  });
}

/**
 * Return sushi sets for client display
 */
function getSushiSets() {
  return sushiSets;
}

/**
 * Compute result from answers using mapping.json weighted algorithm.
 *
 * answers: either:
 *  - array of strings (values) (assumed ordered -> matched to question ids 1..n)
 *  - array of objects { questionId, value }
 *
 * Returns: { resultSet, scores, winners, topScore }
 */
function computeResult(answers) {
  if (!Array.isArray(answers)) {
    throw new Error('Answers must be an array');
  }
  if (!mapping) {
    throw new Error('Mapping not loaded');
  }

  // Normalize answers into array of { qid, value }
  const normalized = [];
  for (let i = 0; i < answers.length; i++) {
    const a = answers[i];
    if (typeof a === 'string') {
      // assume ordering corresponds to question ids starting at 1
      const qid = i + 1;
      normalized.push({ questionId: qid, value: a });
    } else if (a && typeof a === 'object') {
      const qid = a.questionId != null ? Number(a.questionId) : (i + 1);
      normalized.push({ questionId: qid, value: a.value });
    } else {
      // ignore invalid entry
    }
  }

  // Initialize scores
  const scores = {};
  for (const cat of mapping.categories) scores[cat] = 0;

  // Helper to get per-question weight (optional overrides)
  function questionWeight(qid) {
    const overrides = (mapping.questionWeights && mapping.questionWeights.overrides) || {};
    if (overrides[String(qid)] != null) return Number(overrides[String(qid)]);
    if (mapping.questionWeights && mapping.questionWeights.default) return Number(mapping.questionWeights.default);
    return 1;
  }

  // Accumulate
  for (const ans of normalized) {
    if (!ans || !ans.value) continue;
    const qidStr = String(ans.questionId);
    const qmap = (mapping.mappings && mapping.mappings[qidStr]) || null;
    if (!qmap) {
      // nothing mapped for this question id
      continue;
    }
    const contributions = qmap[ans.value];
    if (!contributions) {
      // unknown option value (maybe outdated) — ignore gracefully
      continue;
    }
    const qWeight = questionWeight(ans.questionId);
    for (const [cat, w] of Object.entries(contributions)) {
      if (!Object.prototype.hasOwnProperty.call(scores, cat)) {
        // unknown category referenced in mapping — log and skip
        console.warn(`mapping references unknown sushi category "${cat}"`);
        continue;
      }
      scores[cat] += Number(w) * qWeight;
    }
  }

  // Determine winners and top score
  let topScore = -Infinity;
  const winners = [];
  for (const [cat, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      winners.length = 0;
      winners.push(cat);
    } else if (score === topScore) {
      winners.push(cat);
    }
  }

  // Fallback: if all zero or topScore <=0, pick default set marked in sushiSets or first one
  let chosenId = null;
  if (!isFinite(topScore) || topScore <= 0) {
    const fallback = sushiSets.find(s => s.default) || sushiSets[0];
    chosenId = fallback ? fallback.id : null;
  } else {
    if (winners.length === 1) {
      chosenId = winners[0];
    } else {
      // deterministic tie-breaker: mapping.categories order
      chosenId = mapping.categories.find(c => winners.includes(c)) || winners[0];
    }
  }

  const resultSet = sushiSets.find(s => s.id === chosenId) || null;

  return {
    resultSet,
    scores,
    winners,
    topScore
  };
}

module.exports = {
  getSanitizedQuestions,
  getSushiSets,
  computeResult
};
