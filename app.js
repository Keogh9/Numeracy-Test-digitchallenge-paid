document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const instructionsOverlay = document.getElementById('instructions-overlay');
  const testContainer      = document.getElementById('test-container');
  const resultsContainer   = document.getElementById('results-container');
  const startBtn           = document.getElementById('start-btn');
  const prevBtn            = document.getElementById('prev-btn');
  const nextBtn            = document.getElementById('next-btn');
  const clearBtn           = document.getElementById('clear-btn');
  const retakeBtn          = document.getElementById('retake-btn');
  const equationDiv        = document.getElementById('equation');
  const padDiv             = document.getElementById('digit-pad');
  const timerDisplay       = document.getElementById('timer');
  const currentSpan        = document.getElementById('current');
  const totalSpan          = document.getElementById('total');
  const scoreSpan          = document.getElementById('score');
  const totalQSpan         = document.getElementById('total-questions');
  const percentSpan        = document.getElementById('percent');
  const resultsList        = document.getElementById('results-list');

  let questions = [], selected = [], userAnswers = [], current = 0, timerId;

  // 1) Load full bank → pick 10 random
  fetch('questions.json')
    .then(r => r.json())
    .then(qs => {
      questions = qs;
      selected  = shuffleArray(questions).slice(0, 10);
      totalSpan.textContent  = selected.length;
      totalQSpan.textContent = selected.length;
      // Wait for user to start
    });

  // 2) Wire up buttons
  startBtn.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    renderQuestion();
    startTimer(300);
  });
  prevBtn.addEventListener('click', prevQuestion);
  nextBtn.addEventListener('click', nextQuestion);
  clearBtn.addEventListener('click', clearLast);
  retakeBtn.addEventListener('click', () => location.reload());

  // 3) Timer
  function startTimer(seconds) {
    let rem = seconds;
    timerDisplay.textContent = formatTime(rem);
    timerId = setInterval(() => {
      rem--;
      timerDisplay.textContent = formatTime(rem);
      if (rem <= 0) {
        clearInterval(timerId);
        showResults();
      }
    }, 1000);
  }
  function formatTime(sec) {
    const m = String(Math.floor(sec/60)).padStart(2,'0');
    const s = String(sec%60).padStart(2,'0');
    return `${m}:${s}`;
  }

  // 4) Render each question
  function renderQuestion() {
    const q = selected[current];
    equationDiv.innerHTML = '';
    padDiv.innerHTML = '';
    currentSpan.textContent = current + 1;

    // Build equation with blanks
    const parts = q.expr.split(/(__)/g);
    let bi = 0;
    parts.forEach(part => {
      if (part === '__') {
        const span = document.createElement('span');
        span.className = 'blank';
        span.dataset.idx = bi;
        span.textContent = userAnswers[current]?.[bi] ?? '';
        span.addEventListener('click', () => clearBlank(bi));
        equationDiv.appendChild(span);
        bi++;
      } else {
        equationDiv.insertAdjacentText('beforeend', part);
      }
    });

    // Build keypad 1–9
    for (let d = 1; d <= 9; d++) {
      const btn = document.createElement('div');
      btn.className = 'digit';
      btn.textContent = d;
      if (userAnswers[current]?.includes(d)) btn.classList.add('used');
      btn.addEventListener('click', () => pickDigit(d));
      padDiv.appendChild(btn);
    }

    prevBtn.disabled = (current === 0);
    nextBtn.textContent = (current === selected.length - 1 ? 'Submit' : 'Next');
  }

  function pickDigit(d) {
    if (!userAnswers[current]) userAnswers[current] = [];
    const blanks = equationDiv.querySelectorAll('.blank');
    for (let i = 0; i < blanks.length; i++) {
      if (!userAnswers[current][i]) {
        userAnswers[current][i] = d;
        break;
      }
    }
    renderQuestion();
  }
  function clearBlank(i) {
    if (!userAnswers[current]) return;
    userAnswers[current][i] = null;
    renderQuestion();
  }
  function clearLast() {
    const arr = userAnswers[current];
    if (!arr) return;
    const last = arr.map((v,i)=> v? i : -1).filter(i=>i>=0).pop();
    if (last != null) arr[last] = null;
    renderQuestion();
  }

  function prevQuestion() {
    if (current > 0) {
      current--;
      renderQuestion();
    }
  }
  function nextQuestion() {
    const blanks = equationDiv.querySelectorAll('.blank');
    const ua = userAnswers[current] || [];
    if (ua.length < blanks.length || ua.some(v=>!v)) {
      alert('Please fill all blanks before proceeding.');
      return;
    }
    if (current < selected.length - 1) {
      current++;
      renderQuestion();
    } else {
      showResults();
    }
  }

  // 5) Show results
  function showResults() {
    clearInterval(timerId);
    testContainer.style.display    = 'none';
    resultsContainer.style.display = 'flex';

    let score = 0;
    selected.forEach((q, idx) => {
      const ua = userAnswers[idx] || [];
      const correct = q.answers.some(ans =>
        ans.length === ua.length && ans.every((n,i)=> n === ua[i])
      );
      if (correct) score++;

      const li = document.createElement('li');
      const given = ua.join(', ');
      const correctStr = q.answers[0].join(', ');
      li.innerHTML = `
        <strong>Q${idx+1}:</strong> ${q.expr.replace(/__/g,'__')}<br>
        Your answer: <span class="${correct?'correct':'wrong'}">${given}</span>
        ${correct? '' : `<br>Correct: ${correctStr}<br>Rationale: ${q.rationale}`}
      `;
      resultsList.appendChild(li);
    });

    scoreSpan.textContent   = score;
    percentSpan.textContent = Math.round(score/selected.length*100);
  }

  // Utility: shuffle
  function shuffleArray(a) {
    const arr = a.slice();
    for (let i = arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }
});
