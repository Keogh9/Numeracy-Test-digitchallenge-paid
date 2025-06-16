document.addEventListener('DOMContentLoaded', () => {
  // ——— Element references ———
  const overlay        = document.getElementById('overlay');
  const startBtn       = document.getElementById('startBtn');
  const testContainer  = document.getElementById('test-container');
  const promptEl       = document.getElementById('prompt');
  const optionsEl      = document.getElementById('options');
  const timerEl        = document.getElementById('timer');
  const attemptedEl    = document.getElementById('attempted');

  const resultsOverlay = document.getElementById('results-overlay');
  const correctEl      = document.getElementById('correct-count');
  const totalEl        = document.getElementById('total-count');
  const detailsEl      = document.getElementById('detailed-results');
  const retakeBtn      = document.getElementById('retake-btn');
  const homeBtn        = document.getElementById('home-btn');

  // ——— State ———
  let questions    = [];
  let currentIndex = 0;
  let correctCount = 0;
  let results      = [];
  let timerId      = null;
  let remainingSec = 600;  // 10 minutes
  let attempted    = 0;

  // ——— Start Test ———
  startBtn.addEventListener('click', async () => {
    overlay.classList.add('hidden');
    testContainer.classList.remove('hidden');

    // reset state
    currentIndex = 0;
    correctCount = 0;
    results      = [];
    attempted    = 0;
    remainingSec = 600;
    timerEl.textContent     = '10:00';
    attemptedEl.textContent = 'Attempted: 0';
    detailsEl.innerHTML     = '';
    correctEl.textContent   = '0';
    totalEl.textContent     = '0';
    resultsOverlay.classList.add('hidden');

    // load questions.json from the same folder
    const base = window.location.pathname.replace(/\/$/, '');
    const url  = `${base}/questions.json`;

    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(resp.statusText);
      questions = await resp.json();
    } catch (err) {
      alert('Failed to load questions.json');
      console.error(err);
      return;
    }

    totalEl.textContent = questions.length;
    showQuestion();
    startTimer();
  });

  // ——— Retake & Home buttons ———
  retakeBtn.addEventListener('click', () => window.location.reload());
  homeBtn.addEventListener('click', () => window.location.href = '/');

 function showQuestion() {
  // bail out when done
  if (remainingSec <= 0 || currentIndex >= questions.length) {
    return showResults();
  }

  const q = questions[currentIndex];

  // 1) DISPLAY TEXT (was q.text, now q.prompt)
  promptEl.textContent = q.prompt;

  // 2) CLEAR & RENDER OPTIONS
  optionsEl.innerHTML = '';
  q.options.forEach((opt, i) => {
  const btn = document.createElement('button');
  btn.textContent = opt;
  btn.className = 'option-btn';

  btn.addEventListener('click', () => {
    // 1) figure out if the user was right
    const isCorrect = (i === q.correctIndex);

    // 2) fetch the *correct* answer text
    const correctAnswer = q.options[q.correctIndex];

    // 3) grab the rationale for *this* option
    //    (we assume q.rationale is either an array or an object keyed by index)
    let rationaleText;
    if (Array.isArray(q.rationale)) {
      rationaleText = q.rationale[q.correctIndex];
    } else {
      rationaleText = q.rationale[i] || q.rationale;
    }

    // 4) push a fully-populated record into your results[]
    results.push({
      text:      q.prompt,
      user:      opt,
      correct:   correctAnswer,
      rationale: rationaleText,
      isCorrect: isCorrect
    });

    // 5) move on to the next question
    nextQuestion();
  });

  optionsEl.appendChild(btn);
});
}

  // ——— Countdown timer ———
  function startTimer() {
    clearInterval(timerId);
    timerId = setInterval(() => {
      remainingSec--;
      if (remainingSec < 0) {
        clearInterval(timerId);
        return showResults();
      }
      const m = String(Math.floor(remainingSec/60)).padStart(2,'0');
      const s = String(remainingSec%60).padStart(2,'0');
      timerEl.textContent = `${m}:${s}`;
    }, 1000);
  }

  // ——— Show results overlay ———
function showResults() {
  // 1) hide the test area
  testContainer.classList.add('hidden');

  // 2) fill in your totals
  correctEl.textContent = correctCount;
  totalEl.textContent   = results.length;   // number attempted

  // 3) build the detailed-results list
  detailsEl.innerHTML = '';  // clear any old content

  results.forEach((res, idx) => {
    const div = document.createElement('div');
    div.className = 'item ' + (res.isCorrect ? 'correct' : 'incorrect');

    // question text
    div.innerHTML = `
      <strong>Q${idx + 1}:</strong> ${res.text}
      <em>Your answer:</em> ${res.user}
      <em>${res.isCorrect ? '✔ Correct!' : '✘ Correct was:'}</em> ${res.correct}
      <small>${res.rationale}</small>
    `;

    detailsEl.appendChild(div);
  });

  // 4) show the overlay
  resultsOverlay.classList.remove('hidden');
}
});

