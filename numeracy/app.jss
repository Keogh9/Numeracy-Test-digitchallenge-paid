document.addEventListener('DOMContentLoaded', () => {
  // 1) Element refs
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

  // 2) State
  let bank = [], currentIndex = 0;
  const userAnswers = {};
  const answeredSet = new Set();
  let answeredCount = 0;
  let timerId;

  // 3) Disable Start until questions load
  startBtn.textContent = 'Loading…';
  startBtn.disabled = true;

  // 4) Load & shuffle the question bank
  fetch('questions.json')
    .then(res => res.json())
    .then(qs => {
      bank = shuffleArray(qs);
      totalQSpan.textContent = bank.length;
    })
    .catch(err => {
      console.error('Error loading questions.json:', err);
      const msg = instructionsOverlay.querySelector('p');
      msg.textContent = 'Failed to load test. Please try again later.';
    })
    .finally(() => {
      startBtn.textContent = 'Start Test';
      startBtn.disabled = false;
      startBtn.onclick = () => {
        instructionsOverlay.style.display = 'none';
        testContainer.classList.remove('hidden');
        renderQuestion();
        startTimer(300);
      };
    });

  // 5) Navigation & control handlers
  prevBtn.onclick   = () => currentIndex > 0 && (--currentIndex, renderQuestion());
  nextBtn.onclick   = nextQuestion;
  clearBtn.onclick  = clearLast;
  retakeBtn.onclick = () => location.reload();

  // 6) Timer logic
  function startTimer(sec) {
    let rem = sec;
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
  function formatTime(s) {
    const m = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${m}:${ss}`;
  }

  // 7) Render question
  function renderQuestion() {
    const q = bank[currentIndex];
    equationDiv.innerHTML = '';
    padDiv.innerHTML = '';

    let bi = 0;
    q.expr.split(/(__)/g).forEach(part => {
      if (part === '__') {
        const span = document.createElement('span');
        span.className = 'blank';
        span.dataset.idx = bi;
        const ua = userAnswers[currentIndex] || [];
        span.textContent = ua[bi] || '';
        span.onclick = () => clearBlank(bi);
        equationDiv.appendChild(span);
        bi++;
      } else {
        equationDiv.insertAdjacentText('beforeend', part);
      }
    });

    for (let d = 1; d <= 9; d++) {
      const btn = document.createElement('div');
      btn.className = 'digit';
      btn.textContent = d;
      const ua = userAnswers[currentIndex] || [];
      if (ua.includes(d)) btn.classList.add('used');
      btn.onclick = () => pickDigit(d);
      padDiv.appendChild(btn);
    }

    completedSpan.textContent = answeredCount;
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.textContent = (currentIndex === bank.length - 1 ? 'Submit' : 'Next');
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
    const arr = userAnswers[currentIndex];
    if (!arr) return;
    arr[i] = null;
    renderQuestion();
  }

  function clearLast() {
    const arr = userAnswers[currentIndex] || [];
    const last = arr.map((v,i) => v ? i : -1).filter(i=>i>=0).pop();
    if (last >= 0) {
      arr[last] = null;
      renderQuestion();
    }
  }

  function nextQuestion() {
    const blanks = equationDiv.querySelectorAll('.blank');
    const ua = userAnswers[currentIndex] || [];
    if (ua.length < blanks.length || ua.some(v=>!v)) {
      return alert('Please fill all blanks before proceeding.');
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

  // 8) Show results
  function showResults() {
    clearInterval(timerId);
    testContainer.style.display    = 'none';
    resultsContainer.style.display = 'flex';

    let score = 0;
    const answeredIndices = Array.from(answeredSet).sort((a,b)=>a-b);
    resultsList.innerHTML = '';

    answeredIndices.forEach(idx => {
      const q  = bank[idx];
      const ua = userAnswers[idx] || [];
      const userExpr = buildExpression(q.expr, ua);
      const expected = parseInt(q.expr.split('=')[1].trim(),10);
      const actual   = evaluateExpression(userExpr);
      const correct  = (actual === expected);
      if (correct) score++;

      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Q${idx+1}:</strong>
        <span class="${correct?'correct':'wrong'}">
          ${userExpr} = ${expected}
        </span>
      `;
      resultsList.appendChild(li);
    });

    scoreSpan.textContent   = score;
    totalQSpan.textContent  = answeredIndices.length;
    percentSpan.textContent = Math.round(score/answeredIndices.length*100);
  }

  // 9) Helpers
  function buildExpression(expr, ua) {
    let i=0;
    return expr.split(/(__)/g)
      .map(part => part==='__'? ua[i++] : part)
      .join('')
      .split('=')[0]
      .trim();
  }
  function evaluateExpression(str) {
    const jsExpr = str.replace(/×/g,'*').replace(/−/g,'-');
    try { return eval(jsExpr); }
    catch { return NaN; }
  }
  function shuffleArray(a) {
    const arr = a.slice();
    for (let i=arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }
});

