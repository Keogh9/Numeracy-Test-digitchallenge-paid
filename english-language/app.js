document.addEventListener('DOMContentLoaded', () => {
  // --- DOM references ---
  const overlay      = document.getElementById('overlay');
  const startBtn     = document.getElementById('startBtn');
  const testContainer= document.getElementById('test-container');
  const timerEl      = document.getElementById('timer');
  const attemptedEl  = document.getElementById('attempted');
  const promptEl     = document.getElementById('prompt');
  const optionsEl    = document.getElementById('options');

  const resultsOverlay = document.getElementById('results-overlay');
  const correctEl      = document.getElementById('correct-count');
  const totalEl        = document.getElementById('total-count');
  const detailsEl      = document.getElementById('detailed-results');
  const retakeBtn      = document.getElementById('retake-btn');
  const homeBtn        = document.getElementById('home-btn');

  let questions   = [];
  let currentIdx  = 0;
  let correctCnt  = 0;
  let results     = [];
  let attempted   = 0;
  let startTime, timerInterval;

  // Start the test when the user clicks
  startBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    testContainer.classList.remove('hidden');
    attempted = 0;
    correctCnt = 0;
    results = [];
    attemptedEl.textContent = 'Attempted: 0';
    timerEl.textContent = '10:00';
    // load questions then show first
    loadQuestions().then(() => {
      showQuestion();
      startTimer();
    });
  });

  // Fetch the JSON and begin timing
  async function loadQuestions() {
    const res = await fetch('questions.json');
    questions = await res.json();
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 500);
  }

  function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remain = 600 - elapsed;  // 10min=600s
    if (remain <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = '00:00';
      return endTest();
    }
    const m = String(Math.floor(remain/60)).padStart(2,'0');
    const s = String(remain%60).padStart(2,'0');
    timerEl.textContent = `${m}:${s}`;
  }

  function showQuestion() {
    if (questions.length === 0) return;
    // pick next random question
    const idx = Math.floor(Math.random() * questions.length);
    currentIdx++;
    attempted++;
    attemptedEl.textContent = `Attempted: ${attempted}`;
    const q = questions[idx];
    promptEl.textContent = q.text;
    optionsEl.innerHTML = '';
    q.choices.forEach((choice,i) => {
      const btn = document.createElement('button');
      btn.textContent = choice;
      btn.className = 'option-btn';
      btn.addEventListener('click', () => handleAnswer(q, choice));
      optionsEl.appendChild(btn);
    });
  }

  function handleAnswer(q, userAns) {
    const isCorrect = userAns === q.correct;
    if (isCorrect) correctCnt++;
    results.push({
      text: q.text,
      user: userAns,
      correct: q.correct,
      rationale: q.rationale,
      isCorrect
    });
    // continue until time up
    showQuestion();
  }

  function endTest() {
    testContainer.classList.add('hidden');
    correctEl.textContent = correctCnt;
    totalEl.textContent   = results.length;
    detailsEl.innerHTML = '';
    results.forEach((res,i) => {
      const div = document.createElement('div');
      div.className = 'item ' + (res.isCorrect ? 'correct' : 'incorrect');
      div.innerHTML = `
        <strong>Q${i+1}:</strong> ${res.text}
        <br><em>Your answer:</em> ${res.user}
        <br><em>${res.isCorrect ? '✔ Correct!' : '✘ Correct was:'}</em> ${res.correct}
        ${!res.isCorrect ? `<br><small>${res.rationale}</small>` : ''}
      `;
      detailsEl.appendChild(div);
    });
    resultsOverlay.classList.remove('hidden');
  }

  // Retake resets page
  retakeBtn.addEventListener('click', () => location.reload());
  homeBtn.addEventListener('click', () => window.location = '/');

});

