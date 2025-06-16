document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const overlay       = document.getElementById('overlay');
  const startBtn      = document.getElementById('startBtn');
  const testContainer = document.getElementById('test-container');
  const timerEl       = document.getElementById('timer');
  const attemptedEl   = document.getElementById('attempted');
  const promptEl      = document.getElementById('prompt');
  const optionsEl     = document.getElementById('options');

  const resultsOverlay= document.getElementById('results-overlay');
  const correctEl     = document.getElementById('correct-count');
  const totalEl       = document.getElementById('total-count');
  const detailsEl     = document.getElementById('detailed-results');
  const retakeBtn     = document.getElementById('retake-btn');
  const homeBtn       = document.getElementById('home-btn');

  // State
  let questions     = [];
  let currentIndex  = 0;
  let correctCount  = 0;
  let results       = [];
  let attempted     = 0;
  let startTime, timerInterval;

  // Start button
  startBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    testContainer.classList.remove('hidden');

    // reset
    currentIndex = 0;
    correctCount = 0;
    results      = [];
    attempted    = 0;
    attemptedEl.textContent = 'Attempted: 0';
    timerEl.textContent     = '10:00';

    loadQuestions()
      .then(() => {
        showQuestion();
        startTimer();
      });
  });

  // Load JSON bank
  async function loadQuestions() {
    try {
      const res = await fetch('questions.json');
      questions = await res.json();
    } catch (err) {
      alert('Failed to load questions.json');
      console.error(err);
    }
  }

  // Timer
  function startTimer() {
    startTime     = Date.now();
    timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime)/1000);
      const remain  = 600 - elapsed; // 10min
      if (remain <= 0) {
        clearInterval(timerInterval);
        endTest();
      } else {
        const m = String(Math.floor(remain/60)).padStart(2,'0');
        const s = String(remain%60).padStart(2,'0');
        timerEl.textContent = `${m}:${s}`;
      }
    }, 500);
  }

  // Show one question
  function showQuestion() {
    const q = questions[currentIndex];
    if (!q) return endTest();

    // prompt + options
    promptEl.textContent = q.prompt;
    optionsEl.innerHTML  = '';

    q.options.forEach((opt,i) => {
      const btn = document.createElement('button');
      btn.textContent = opt;
      btn.className   = 'option-btn';
      btn.addEventListener('click', () => {
        attempted++;
        attemptedEl.textContent = `Attempted: ${attempted}`;

        const isCorrect     = (i === q.correctIndex);
        if (isCorrect) correctCount++;
        const correctAnswer = q.options[q.correctIndex];
        const rationaleText = Array.isArray(q.rationale)
          ? q.rationale[i]
          : q.rationale;

        results.push({
          text:      q.prompt,
          user:      opt,
          correct:   correctAnswer,
          rationale: rationaleText,
          isCorrect: isCorrect
        });

        currentIndex++;
        showQuestion();
      });
      optionsEl.appendChild(btn);
    });
  }

  // End
  function endTest() {
    clearInterval(timerInterval);
    testContainer.classList.add('hidden');
    correctEl.textContent = correctCount;
    totalEl.textContent   = questions.length;

    // detailed results (for now leave empty; you can adjust layout later)
    detailsEl.innerHTML = '';
    resultsOverlay.classList.remove('hidden');
  }

  // Retake & Home
  retakeBtn.addEventListener('click', () => {
    resultsOverlay.classList.add('hidden');
    overlay.classList.remove('hidden');
  });
  homeBtn.addEventListener('click', () => location.href = '/');
});

