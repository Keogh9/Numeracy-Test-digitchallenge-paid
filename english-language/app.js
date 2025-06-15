document.addEventListener('DOMContentLoaded', () => {
  // ——— grab all the pieces ———
  const overlay        = document.getElementById('overlay');
  const startBtn       = document.getElementById('startBtn');
  const testContainer  = document.getElementById('test-container');
  const timerEl        = document.getElementById('timer');
  const attemptedEl    = document.getElementById('attempted');
  const promptEl       = document.getElementById('prompt');
  const optionsEl      = document.getElementById('options');

  const resultsOverlay = document.getElementById('results-overlay');
  const correctEl      = document.getElementById('correct-count');
  const totalEl        = document.getElementById('total-count');
  const detailsEl      = document.getElementById('detailed-results');
  const retakeBtn      = document.getElementById('retake-btn');
  const homeBtn        = document.getElementById('home-btn');

  // ——— state vars ———
  let questions      = [];
  let currentIndex   = 0;
  let correctCount   = 0;
  let results        = [];
  let startTime;
  let timerInterval;
  let attemptedCount = 0;

  // ——— start the test on button click ———
  startBtn.addEventListener('click', () => {
    // hide instructions
    overlay.classList.add('hidden');
    // show test area
    testContainer.classList.remove('hidden');
    // reset
    currentIndex   = 0;
    correctCount   = 0;
    results        = [];
    attemptedCount = 0;
    attemptedEl.textContent = 'Attempted: 0';
    timerEl.textContent     = '10:00';
    // load & then show first
    loadQuestions()
      .then(() => {
        showQuestion();
        startTimer();
      })
      .catch(err => {
        alert('Failed to load questions.json');
        console.error(err);
      });
  });

  // ——— fetch questions.json ———
  async function loadQuestions() {
    const res = await fetch('questions.json');
    questions = await res.json();
    // timestamp & start ticking
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 500);
  }

  // ——— countdown display ———
  function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const remain  = 600 - elapsed; // 10×60
    if (remain <= 0) {
      clearInterval(timerInterval);
      timerEl.textContent = '00:00';
      endTest();
    } else {
      const m = String(Math.floor(remain/60)).padStart(2,'0');
      const s = String(remain%60).padStart(2,'0');
      timerEl.textContent = `${m}:${s}`;
    }
  }

  // ——— show current question & options ———
  function showQuestion() {
    const q = questions[currentIndex];
    promptEl.textContent = q.prompt;
    optionsEl.innerHTML = '';

    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.textContent = opt;
      btn.addEventListener('click', () => handleAnswer(i));
      optionsEl.appendChild(btn);
    });
  }

  // ——— when user picks an answer ———
  function handleAnswer(choiceIdx) {
    const q = questions[currentIndex];
    const isCorrect = choiceIdx === q.correctIndex;
    if (isCorrect) correctCount++;

    // record for results page
    results.push({
      text       : q.prompt,
      user       : q.options[choiceIdx],
      correct    : q.options[q.correctIndex],
      rationale  : q.rationale[ choiceIdx ],
      isCorrect
    });

    // update attempted count
    attemptedCount++;
    attemptedEl.textContent = `Attempted: ${attemptedCount}`;

    // next or finish
    currentIndex++;
    if (currentIndex < questions.length) {
      showQuestion();
    } else {
      endTest();
    }
  }

  // ——— wrap up & show results overlay ———
  function endTest() {
    clearInterval(timerInterval);
    testContainer.classList.add('hidden');

    correctEl.textContent = correctCount;
    totalEl.textContent   = questions.length;

    // build detail list
    detailsEl.innerHTML = '';
    results.forEach((r,i) => {
      const div = document.createElement('div');
      div.className =
        'item ' + (r.isCorrect ? 'correct' : 'incorrect');
      div.innerHTML = `
        <strong>Q${i+1}:</strong> ${r.text}<br>
        <em>Your answer:</em> ${r.user}<br>
        <em>${r.isCorrect ? 'Well done!' : 'Correct was:'}</em>
        ${r.correct}<br>
        <small>${r.rationale}</small>
      `;
      detailsEl.appendChild(div);
    });

    resultsOverlay.classList.remove('hidden');
  }

  // ——— retry from start ———
  retakeBtn.addEventListener('click', () => {
    resultsOverlay.classList.add('hidden');
    overlay.classList.remove('hidden');
  });

  // ——— back to home ———
  homeBtn.addEventListener('click', () => {
    window.location.href = '/';
  });
});

