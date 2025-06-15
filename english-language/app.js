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

  // ——— Show one question ———
  function showQuestion() {
    // end if no time or no more questions
    if (remainingSec <= 0 || currentIndex >= questions.length) {
      return showResults();
    }

    const q = questions[currentIndex];
    promptEl.textContent = q.prompt;
    optionsEl.innerHTML   = '';

    q.options.forEach(choice => {       // your JSON must have "options":[…]
      const btn = document.createElement('button');
      btn.textContent = choice;
      btn.className   = 'option-btn';
      btn.addEventListener('click', () => {
        // record answer
        const isCorrect = (choice === q.answer);  // JSON: "answer": "must"
        if (isCorrect) correctCount++;
        results.push({
          text      : q.text,
          user      : choice,
          correct   : q.answer,
          rationale : q.explanation,               // JSON: "explanation": "…"
          isCorrect
        });

        // update attempted counter & move on
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

