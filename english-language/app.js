document.addEventListener('DOMContentLoaded', () => {
  // ==== TEST AREA ELEMENTS ====
  const startBtn      = document.getElementById('start-test');
  const testContainer = document.getElementById('test-container');
  const timerEl       = document.getElementById('timer');
  const attemptedEl   = document.getElementById('attempted');
  const promptEl      = document.getElementById('prompt');
  const optionsEl     = document.getElementById('options');

  // ==== RESULTS OVERLAY ELEMENTS ====
  const resultsOverlay= document.getElementById('results-overlay');
  const correctEl     = document.getElementById('correct-count');
  const totalEl       = document.getElementById('total-count');
  const detailsEl     = document.getElementById('detailed-results');
  const retakeBtn     = document.getElementById('retake-btn');
  const homeBtn       = document.getElementById('home-btn');

  let questions = [];
  let startTime;
  let timerInterval;
  let attempted = 0;

startBtn.addEventListener('click', () => {
  // 1) Hide the intro overlay
  overlay.classList.add('hidden');
  // 2) Show the test area
  testContainer.classList.remove('hidden');

  // 3) Reset counters & results array
  currentIndex    = 0;
  correctCount    = 0;
  results         = [];
  attemptedEl.textContent = '0';
  timerEl.textContent     = '10:00';

  // 4) Load questions, then render Q1 & start timer
  loadQuestions().then(() => {
    showQuestion();
    startTimer();
  });
});

  async function loadQuestions() {
    try {
      const res = await fetch('questions.json');
      questions = await res.json();
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 500);
      nextQuestion();
    } catch (err) {
      alert('Failed to load questions.');
      console.error(err);
    }
  }

  function updateTimer() {
    const elapsedSec = Math.floor((Date.now() - startTime) / 1000);
    const remaining = 600 - elapsedSec; // 10 min = 600 sec
    if (remaining <= 0) {
      timerEl.textContent = '00:00';
      clearInterval(timerInterval);
      endTest();
    } else {
      const m = String(Math.floor(remaining / 60)).padStart(2, '0');
      const s = String(remaining % 60).padStart(2, '0');
      timerEl.textContent = `${m}:${s}`;
    }
  }

  function nextQuestion() {
  attempted++;
  attemptedEl.textContent = `Attempted: ${attempted}`;
  // pick a random question from the full bank
  const idx = Math.floor(Math.random() * questions.length);
  const q = questions[idx];
  showQuestion(q);
}
  function showQuestion(q) {
    promptEl.textContent = q.prompt;
    optionsEl.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.className = 'option-btn';
      btn.addEventListener('click', () => {
        // TODO: record correctness + rationale
        nextQuestion();
      });
      optionsEl.appendChild(btn);
    });
  }

function showResults() {
  // hide the test area
  testArea.classList.add('hidden');
  // put totals into the overlay
  correctEl.textContent = correctCount;
  totalEl.textContent   = questions.length;

  // build the scrollable breakdown
  detailsEl.innerHTML = '';
  results.forEach((res, idx) => {
    const div = document.createElement('div');
    div.className = 'item ' + (res.isCorrect ? 'correct' : 'incorrect');
    div.innerHTML = `
      <strong>Q${idx+1}:</strong> ${res.text}
      <br>
      <em>Your answer:</em> ${res.user}
      <br>
      <em>${res.isCorrect ? 'Well done!' : 'Correct was:'}</em> ${res.correct}
      <br>
      <small>${res.rationale}</small>
    `;
    detailsEl.appendChild(div);
  });

  // show the overlay
  resultsOverlay.classList.remove('hidden');
}

});
