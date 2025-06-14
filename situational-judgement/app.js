let questions = [];
let currentIndex = 0;
let correctCount = 0;
let attemptedCount = 0;

const overlay     = document.getElementById('overlay');
const startBtn    = document.getElementById('start-button');
const testArea    = document.getElementById('test-area');
const scenarioEl  = document.getElementById('scenario');
const optionsEl   = document.getElementById('options');
const rationaleEl = document.getElementById('rationale');
const nextBtn     = document.getElementById('next-button');
const qNumberEl   = document.getElementById('question-number');
const attemptedEl = document.getElementById('attempted-count');

const resultsOverlay = document.getElementById('results');
const correctEl      = document.getElementById('correct-count');
const wrongEl        = document.getElementById('wrong-count');
const retakeBtn      = document.getElementById('retake-button');
const homeBtn        = document.getElementById('home-button');

fetch('questions.json')
  .then(r => r.json())
  .then(data => { questions = data; })
  .catch(() => alert('Failed to load questions.json'));

startBtn.addEventListener('click', () => {
  overlay.classList.add('hidden');
  testArea.classList.remove('hidden');
  renderQuestion();
});

function renderQuestion() {
  const q = questions[currentIndex];
  qNumberEl.textContent = `Scenario ${currentIndex+1} of ${questions.length}`;
  scenarioEl.textContent = q.scenario;
  optionsEl.innerHTML = '';
  rationaleEl.classList.add('hidden');
  nextBtn.classList.add('hidden');

  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'btn';
    btn.textContent = opt;
    btn.addEventListener('click', () => selectAnswer(i));
    optionsEl.appendChild(btn);
  });
}

function selectAnswer(selectedIndex) {
  const q = questions[currentIndex];
  attemptedCount++;
  attemptedEl.textContent = attemptedCount;

  // disable all buttons
  Array.from(optionsEl.children).forEach(b=>b.disabled=true);

  const correct = selectedIndex === q.correctIndex;
  if (correct) correctCount++;

  // show rationale
  rationaleEl.innerHTML = `
    <p><strong>Your choice:</strong> ${q.options[selectedIndex]}</p>
    <p><strong>Feedback:</strong> ${q.rationale[selectedIndex]}</p>
  `;
  rationaleEl.classList.remove('hidden');
  nextBtn.classList.remove('hidden');
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResults();
  }
});

function showResults() {
  testArea.classList.add('hidden');
  resultsOverlay.classList.remove('hidden');
  correctEl.textContent = correctCount;
  wrongEl.textContent   = questions.length - correctCount;
}

retakeBtn.addEventListener('click', () => location.reload());
homeBtn.addEventListener('click', () => window.location.href = '/');
