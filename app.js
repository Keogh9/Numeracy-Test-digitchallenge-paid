document.addEventListener('DOMContentLoaded', () => {
  // Element references
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
  const completedSpan      = document.getElementById('completed');
  const scoreSpan          = document.getElementById('score');
  const totalQSpan         = document.getElementById('total-questions');
  const percentSpan        = document.getElementById('percent');
  const resultsList        = document.getElementById('results-list');

  // State
  let bank = [];
  let currentIndex = 0;
  const userAnswers = {};
  const answeredSet = new Set();
  let answeredCount = 0;
  let timerId;

  // 1) Load and shuffle the full question bank
  fetch('questions.json')
    .then(res => res.json())
    .then(qs => {
      bank = shuffleArray(qs);
    });

  // 2) Button handlers
  startBtn.onclick = () => {
    instructionsOverlay.style.display = 'none';
    testContainer.classList.remove('hidden');
    renderQuestion();
    startTimer(300);
  };
  prevBtn.onclick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  };
  nextBtn.onclick = nextQuestion;
  clearBtn.onclick = clearLast;
  retakeBtn.onclick = () => location.reload();

  // 3) Timer logic
  function startTimer(seconds) {
    let remaining = seconds;
    timerDisplay.textContent = formatTime(remaining);
    timerId = setInterval(() => {
      remaining--;
      timerDisplay.textContent = formatTime(remaining);
      if (remaining <= 0) {
        clearInterval(timerId);
        showResults();
      }
    }, 1000);
  }

  function formatTime(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${m}:${s}`;
  }

  // 4) Render current question
  function renderQuestion() {
    const q = bank[currentIndex];
    equationDiv.innerHTML = '';
    padDiv.innerHTML = '';

    // Build equation with blanks
    let blankIdx = 0;
    q.expr.split(/(__)/g).forEach(part => {
      if (part === '__') {
        const span = document.createElement('span');
        span.className = 'blank';
        span.dataset.idx = blankIdx;
        const ua = userAnswers[currentIndex] || [];
        span.textContent = ua[blankIdx] || '';
        span.onclick = () => clearBlank(blankIdx);
        equationDiv.appendChild(span);
        blankIdx++;
      } else {
        equationDiv.insertAdjacentText('beforeend', part);
      }
    });

    // Build digit pad
    for (let d = 1; d <= 9; d++) {
      const btn = document.createElement('div');
      btn.className = 'digit';
      btn.textContent = d;
      const ua = userAnswers[currentIndex] || [];
      if (ua.includes(d)) btn.classList.add('used');
      btn.onclick = () => pickDigit(d);
      padDiv.appendChild(btn);
    }

    // Update completed count
    completedSpan.textContent = answeredCount;
  }

  function pickDigit(d) {
    if (!userAnswers[currentIndex]) userAnswers[currentIndex] = [];
    const blanks = equationDiv.querySelectorAll('.blank');
    for (let i = 0; i < blanks.length; i++) {
      if (!userAnswers[currentIndex][i]) {
        userAnswers[currentIndex][i] = d;
        break;
      }
    }
    renderQuestion();
  }

  function clearBlank(i) {
    if (!userAnswers[currentIndex]) return;
    userAnswers[currentIndex][i] = null;
    renderQuestion();
  }

  function clearLast() {
    const arr = userAnswers[currentIndex] || [];
    const last = arr.map((v, i) => v ? i : -1).filter(i => i >= 0).pop();
    if (last >= 0) {
      arr[last] = null;
      renderQuestion();
    }
  }

  function nextQuestion() {
    const blanks = equationDiv.querySelectorAll('.blank');
    const ua = userAnswers[currentIndex] || [];
    if (ua.length < blanks.length || ua.some(v => !v)) {
      alert('Please fill all blanks before proceeding.');
      return;
    }
    if (!answeredSet.has(currentIndex)) {
      answeredSet.add(currentIndex);
      answeredCount++;
    }
    currentIndex++;
    if (currentIndex >= bank.length) {
      showResults();
    } else {
      renderQuestion();
    }
  }

  // 5) Enhanced results display
  function showResults() {
    clearInterval(timerId);
    testContainer.style.display    = 'none';
    resultsContainer.style.display = 'flex';

    let score = 0;
    const answeredIndices = Array.from(answeredSet).sort((a, b) => a - b);
    resultsList.innerHTML = '';

    answeredIndices.forEach(idx => {
      const q = bank[idx];
      const ua = userAnswers[idx] || [];
      const userExpr = buildExpression(q.expr, ua);
      const expected = parseInt(q.expr.split('=')[1].trim(), 10);
      const actual = evaluateExpression(userExpr);

      const correct = q.answers.some(ans =>
        ans.length === ua.length &&
        ans.every((n, i) => n === ua[i])
      );
      if (correct) score++;

      const li = document.createElement('li');
      if (correct) {
        li.innerHTML = `
          <strong>Q${idx+1}:</strong>
          <span class="correct">${userExpr} = ${expected}</span>
        `;
      } else {
        li.innerHTML = `
          <strong>Q${idx+1}:</strong>
          <span class="wrong">${userExpr} = ${actual}</span><br>
          <em>Using BOMDAS, you get ${actual}, not ${expected}.</em>
        `;
      }
      resultsList.appendChild(li);
    });

    scoreSpan.textContent   = score;
    totalQSpan.textContent  = answeredIndices.length;
    percentSpan.textContent = Math.round(score / answeredIndices.length * 100);
  }

  // Helper: build the user's expression string
  function buildExpression(expr, ua) {
    let i = 0;
    return expr
      .split(/(__)/g)
      .map(part => part === '__' ? ua[i++] : part)
      .join('')
      .split('=')[0]
      .trim();
  }

  // Helper: evaluate arithmetic in string
  function evaluateExpression(str) {
    const jsExpr = str.replace(/×/g, '*').replace(/−/g, '-');
    try {
      // eslint-disable-next-line no-eval
      return eval(jsExpr);
    } catch {
      return NaN;
    }
  }

  // Utility: Fisher–Yates shuffle
  function shuffleArray(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
});


