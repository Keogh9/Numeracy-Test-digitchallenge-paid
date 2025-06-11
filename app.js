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
  const completedSpan      = document.getElementById('completed');
  const scoreSpan          = document.getElementById('score');
  const totalQSpan         = document.getElementById('total-questions');
  const percentSpan        = document.getElementById('percent');
  const resultsList        = document.getElementById('results-list');

  let bank = [], currentIndex = 0, userAnswers = {}, answeredSet = new Set(), answeredCount = 0, timerId;

  // 1) Load full bank & shuffle
  fetch('questions.json')
    .then(res => res.json())
    .then(qs => {
      bank = shuffleArray(qs);
    });

  // 2) Button handlers
  startBtn.addEventListener('click', () => {
    instructionsOverlay.style.display = 'none';
    testContainer.classList.remove('hidden');
    renderQuestion();
    startTimer(300);
  });
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      renderQuestion();
    }
  });
  nextBtn.addEventListener('click', nextQuestion);
  clearBtn.addEventListener('click', clearLast);
  retakeBtn.addEventListener('click', () => location.reload());

  // 3) Timer
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
  function formatTime(sec) {
    const m = String(Math.floor(sec/60)).padStart(2,'0');
    const s = String(sec%60).padStart(2,'0');
    return `${m}:${s}`;
  }

  // 4) Render question
  function renderQuestion() {
    const q = bank[currentIndex];
    equationDiv.innerHTML = '';
    padDiv.innerHTML = '';
    // Build equation with blanks
    let bi = 0;
    q.expr.split(/(__)/g).forEach(part => {
      if (part === '__') {
        const span = document.createElement('span');
        span.className = 'blank';
        span.dataset.idx = bi;
        const ua = userAnswers[currentIndex] || [];
        span.textContent = ua[bi] || '';
        span.addEventListener('click', () => clearBlank(bi));
        equationDiv.appendChild(span);
        bi++;
      } else {
        equationDiv.insertAdjacentText('beforeend', part);
      }
    });
    // Build keypad
    for (let d = 1; d <= 9; d++) {
      const btn = document.createElement('div');
      btn.className = 'digit';
      btn.textContent = d;
      const ua = userAnswers[currentIndex] || [];
      if (ua.includes(d)) btn.classList.add('used');
      btn.addEventListener('click', () => pickDigit(d));
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
    const last = arr.map((v,i)=> v? i : -1).filter(i=>i>=0).pop();
    if (last >= 0) {
      arr[last] = null;
      renderQuestion();
    }
  }

  function nextQuestion() {
    const blanks = equationDiv.querySelectorAll('.blank');
    const ua = userAnswers[currentIndex] || [];
    if (ua.length < blanks.length || ua.some(v=>!v)) {
      alert('Please fill all blanks before proceeding.');
      return;
    }
    // First-time answer?
    if (!answeredSet.has(currentIndex)) {
      answeredSet.add(currentIndex);
      answeredCount++;
    }
    // Move on
    currentIndex++;
    // If somehow we exhaust bank, end test
    if (currentIndex >= bank.length) {
      showResults();
    } else {
      renderQuestion();
    }
  }

  // 5) Show results
  function showResults() {
    clearInterval(timerId);
    testContainer.style.display    = 'none';
    resultsContainer.style.display = 'flex';

    let score = 0;
    // Iterate through answered questions in order
    Array.from(answeredSet).sort((a,b)=>a-b).forEach(idx => {
      const q = bank[idx];
      const ua = userAnswers[idx] || [];
      const correct = q.answers.some(ans =>
        ans.length===ua.length && ans.every((n,i)=>n===ua[i])
      );
      if (correct) score++;
      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Q${idx+1}:</strong> ${q.expr}<br>
        Your answer: <span class="${correct?'correct':'wrong'}">${ua.join(', ')}</span>
        ${!correct? `<br>Correct: ${q.answers[0].join(', ')}` : ''}
      `;
      resultsList.appendChild(li);
    });

    scoreSpan.textContent   = score;
    totalQSpan.textContent  = answeredCount;
    percentSpan.textContent = Math.round(score/answeredCount*100);
  }

  // Utils
  function shuffleArray(a) {
    const arr = a.slice();
    for (let i = arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }
});

