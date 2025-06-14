document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('overlay');
  const startBtn = document.getElementById('startBtn');
  const testContainer = document.getElementById('test-container');
  const timerEl = document.getElementById('timer');
  const attemptedEl = document.getElementById('attempted');
  const promptEl = document.getElementById('prompt');
  const optionsEl = document.getElementById('options');

  let questions = [];
  let startTime;
  let timerInterval;
  let attempted = 0;

  startBtn.addEventListener('click', () => {
    // hide overlay, show test area
    overlay.style.display = 'none';
    testContainer.classList.remove('hidden');
    loadQuestions();
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
    if (questions.length === 0) return endTest();
    attempted++;
    attemptedEl.textContent = `Attempted: ${attempted}`;
    const q = questions.shift();
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

  function endTest() {
    // For now just reload. You can hook in your results-page here.
    alert(`Time’s up! You attempted ${attempted} questions.`);
    window.location.reload();
  }
});
