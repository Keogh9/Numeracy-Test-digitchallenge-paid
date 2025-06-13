document.addEventListener('DOMContentLoaded', () => {
  const instrOvl  = document.getElementById('instructions-overlay');
  const testC     = document.getElementById('test-container');
  const resultsC  = document.getElementById('results-container');
  const startBtn  = document.getElementById('start-btn');
  const promptEl  = document.getElementById('question-prompt');
  const optsEl    = document.getElementById('options-container');
  const timerEl   = document.getElementById('timer');
  const attEl     = document.getElementById('attempted');
  const scoreEl   = document.getElementById('score');
  const totalEl   = document.getElementById('total');
  const listEl    = document.getElementById('results-list');
  const retakeBtn = document.getElementById('retake-btn');
  const homeBtn   = document.getElementById('home-btn');

  let bank = [], idx = 0, ready = false;
  const responses = [];
  let timerId, startTime;

  // Load questions
  fetch('questions.json')
    .then(r => r.json())
    .then(qs => {
      // shuffle and sort by difficulty if you like
      bank = shuffle(qs);
      ready = true;
    })
    .catch(() => alert('Failed to load questions.'));

  startBtn.onclick = () => {
    if (!ready) return alert('Loading…');
    instrOvl.style.display = 'none';
    testC.classList.remove('hidden');
    startTime = Date.now();
    startTimer(600); // 10 minutes
    nextQuestion();
  };

  function startTimer(sec) {
    timerEl.textContent = fmt(sec);
    timerId = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const rem = Math.max(0, sec - elapsed);
      timerEl.textContent = fmt(rem);
      if (rem <= 0) {
        clearInterval(timerId);
        endTest();
      }
    }, 200);
  }
  function fmt(s) {
    const m = String(Math.floor(s/60)).padStart(2,'0'),
          ss= String(Math.floor(s%60)).padStart(2,'0');
    return `${m}:${ss}`;
  }

  function nextQuestion() {
    const q = bank[idx++];
    renderQuestion(q);
  }

  function renderQuestion(q) {
    promptEl.textContent = q.prompt;
    optsEl.innerHTML = '';
    const count = responses.length + 1;
    attEl.textContent = count;

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.onclick = () => recordAnswer(q, i);
      optsEl.appendChild(btn);
    });
  }

  function recordAnswer(q, picked) {
    const correct = picked === q.correct;
    responses.push({ q, picked, correct });
    if ((Date.now() - startTime) / 1000 < 600) {
      nextQuestion();
    } else {
      endTest();
    }
  }

  function endTest() {
    clearInterval(timerId);
    testC.style.display = 'none';
    resultsC.style.display = 'flex';

    const total    = responses.length;
    const score    = responses.filter(r=>r.correct).length;
    scoreEl.textContent = score;
    totalEl.textContent = total;

    listEl.innerHTML = '';
    responses.forEach((r,i) => {
      const li = document.createElement('li');
      const q  = r.q;
      const user = q.options[r.picked];
      const correctOpt = q.options[q.correct];
      li.innerHTML = `
        <strong>Q${i+1}:</strong>
        <span class="${r.correct?'correct':'wrong'}">
          You: ${user} &mdash; Correct: ${correctOpt}
        </span>
        <div class="rationale">${q.rationale}</div>
      `;
      listEl.appendChild(li);
    });
  }

  retakeBtn.onclick = () => location.reload();
  homeBtn.onclick   = () => window.location.href = '/';

  // helpers
  function shuffle(a) {
    const arr = [...a];
    for (let i=arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }
});
