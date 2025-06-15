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
  q.options.forEach((choice, i) => {
    const btn = document.createElement('button');
    btn.textContent = choice;
    btn.className   = 'option-btn';
    btn.addEventListener('click', () => {
      // 3) RECORD CORRECTNESS using correctIndex
      const isCorrect     = i === q.correctIndex;
      const correctValue = q.options[q.correctIndex];

      if (isCorrect) correctCount++;
      results.push({
        text      : q.prompt,
        user      : choice,
        correct   : correctValue,
        rationale : q.rationale,    // or whatever your JSON calls it
        isCorrect
      });

      // 4) UPDATE ATTEMPTED + MOVE ON
      attempted++;
      attemptedEl.textContent = `Attempted: ${attempted}`;
      currentIndex++;
      showQuestion();
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
    clearInterval(timerId);
    testContainer.classList.add('hidden');

    correctEl.textContent = String(correctCount);
    totalEl.textContent   = String(attempted);

    detailsEl.innerHTML = '';
    results.forEach((res, i) => {
      const div = document.createElement('div');
      div.className = `item ${res.isCorrect ? 'correct' : 'incorrect'}`;
      div.innerHTML = `
        <strong>Q${i+1}:</strong> ${res.text}<br>
        <em>Your answer:</em> ${res.user}<br>
        <em>${res.isCorrect ? 'Well done!' : 'Correct was:'}</em> ${res.correct}<br>
        <small>${res.rationale}</small>
      `;
      detailsEl.appendChild(div);
    });

    resultsOverlay.classList.remove('hidden');
  }
});

