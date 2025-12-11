// src/public/js/app.js
(() => {
  // Elements
  const el = (id) => document.getElementById(id);
  const viewLanding = el('view-landing');
  const viewQuiz = el('view-quiz');
  const viewResult = el('view-result');
  const btnStart = el('btn-start');
  const btnRetry = el('btn-retry');
  const questionText = el('question-text');
  const optionsGrid = el('options-grid');
  const resultName = el('result-name');
  const resultImage = el('result-image');
  const resultDesc = el('result-desc');
  const toast = el('toast');

  // App state
  let questions = [];
  let sushiSets = [];
  let currentIndex = 0;
  let answers = []; // array of {questionId, value}
  let isBusy = false;

  // Helpers
  function showToast(msg, timeout = 2500) {
    toast.textContent = msg;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), timeout);
  }

  function switchView(viewEl) {
    [viewLanding, viewQuiz, viewResult].forEach(v => v.classList.remove('active'));
    viewEl.classList.add('active');
  }

  async function fetchJSON(url, opts = {}) {
    const res = await fetch(url, opts);
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    return res.json();
  }

  // Initialize (load questions and sushi sets)
  async function initData() {
    try {
      const qResp = await fetchJSON('/api/questions');
      questions = Array.isArray(qResp.questions) ? qResp.questions : qResp.questions || [];
      // We expect 10 questions; if backend has more, we use first 10
      if (questions.length > 10) questions = questions.slice(0, 10);
      // fetch sushi sets for result display
      const sResp = await fetchJSON('/api/sushi');
      sushiSets = sResp.sets || [];
      preloadImages();
    } catch (err) {
      console.error('Failed to load initial data:', err);
      showToast('Failed to load quiz data. Is backend running?');
    }
  }

  function preloadImages() {
    const urls = new Set();
    for (const q of questions) {
      for (const opt of q.options || []) urls.add(opt.image);
    }
    for (const s of sushiSets) {
      if (s.image) urls.add(s.image);
    }
    urls.forEach(u => {
      if (!u) return;
      const i = new Image();
      i.src = u;
    });
  }

  // Render a question (one by one)
  function renderQuestion(index) {
    const q = questions[index];
    if (!q) {
      questionText.textContent = 'No question available';
      optionsGrid.innerHTML = '';
      return;
    }
    questionText.textContent = q.question;
    optionsGrid.innerHTML = '';

    q.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'option fade-in';
      btn.type = 'button';
      btn.dataset.value = opt.value || '';
      btn.dataset.qid = q.id;
      btn.innerHTML = `
        <img src="${opt.image}" alt="${escapeHtml(opt.label)}" loading="lazy" />
        <div class="label">${escapeHtml(opt.label)}</div>
      `;
      btn.addEventListener('click', () => onSelectOption(q.id, opt.value, btn));
      optionsGrid.appendChild(btn);
    });
  }

  // Escape utility
  function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  // Called when user picks an option
  async function onSelectOption(questionId, value, btnEl) {
    if (isBusy) return;
    isBusy = true;

    // Quick visual feedback: disable all options and slightly highlight selected
    Array.from(optionsGrid.children).forEach(ch => {
      ch.classList.add('disabled');
      ch.style.opacity = '0.85';
    });
    btnEl.style.opacity = '1';
    btnEl.style.transform = 'translateY(-4px)';

    // Record answer
    answers.push({ questionId, value });

    // Small delay so user sees their click, then advance
    setTimeout(() => {
      currentIndex += 1;
      if (currentIndex >= questions.length) {
        // final calculation and show result
        finalizeResult();
      } else {
        renderQuestion(currentIndex);
      }
      isBusy = false;
    }, 220); // short delay
  }

  // Finalize - ask backend for final result and show result view
  async function finalizeResult() {
    try {
      const payload = { answers: answers.map(a => a.value ? a.value : a) };
      const resp = await fetchJSON('/api/sushi/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const r = resp.result;
      if (!r) {
        showToast('Could not determine a result. Try again.');
        resetQuiz();
        return;
      }
      // show result
      resultName.textContent = r.name;
      resultImage.src = r.image || '';
      resultImage.alt = r.name;
      resultDesc.textContent = r.description || '';
      switchView(viewResult);
    } catch (err) {
      console.error('Failed to fetch final result:', err);
      showToast('Network error while getting result');
      resetQuiz();
    }
  }

  function resetQuiz() {
    currentIndex = 0;
    answers = [];
    renderQuestion(0);
    switchView(viewLanding);
  }

  // Event wiring
  btnStart.addEventListener('click', async () => {
    // ensure data loaded
    if (questions.length === 0 || sushiSets.length === 0) {
      await initData();
    }
    currentIndex = 0;
    answers = [];
    renderQuestion(currentIndex);
    switchView(viewQuiz);
  });

  btnRetry.addEventListener('click', () => {
    resetQuiz();
  });

  // On load: attempt to prefetch data so start is snappy
  window.addEventListener('load', () => {
    initData().catch(err => console.warn('initData failed:', err));
  });

})();
