// app.js

// --- CACHE DOM NODES ---
const overlay    = document.getElementById('overlay');
const startBtn   = document.getElementById('startBtn');
const game       = document.getElementById('game');
const gridEl     = document.getElementById('grid');
const skipBtn    = document.getElementById('skipBtn');
const nextBtn    = document.getElementById('nextBtn');
const timerEl    = document.getElementById('timer');
const attemptedEl= document.getElementById('attempted');

// --- STATE ---
let questions = [];
let current   = 0;
let attempted = 0;
let timeLeft  = 6 * 60;   // 6 minutes in seconds
let timerId;

// --- EVENT LISTENERS ---
startBtn.addEventListener('click', startTest);
skipBtn .addEventListener('click', () => answerPuzzle(true));
nextBtn .addEventListener('click', () => answerPuzzle(false));

// --- START THE TEST ---
function startTest() {
  overlay.classList.add('hidden');
  game.classList.remove('hidden');
  startTimer();
  loadQuestions();
}

// --- TIMER ---
function startTimer() {
  updateTimer();
  timerId = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) return finishTest();
    updateTimer();
  }, 1000);
}
function updateTimer() {
  const m = String(Math.floor(timeLeft/60)).padStart(2,'0');
  const s = String(timeLeft%60).padStart(2,'0');
  timerEl.textContent = `${m}:${s}`;
}

// --- LOAD & SHUFFLE QUESTIONS ---
async function loadQuestions() {
  try {
    const res = await fetch('./questions.json');
    questions = await res.json();
    shuffle(questions);
    renderCurrentPuzzle();
  } catch (err) {
    alert('Failed to load test. Please check your network/JSON file.');
    console.error(err);
  }
}
function shuffle(a) {
  for (let i=a.length-1; i>0; i--) {
    const j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

// --- RENDER CURRENT PUZZLE ---
function renderCurrentPuzzle() {
  const q = questions[current];
  attemptedEl.textContent = `Attempted: ${attempted}`;
  
  // set grid dimensions
  gridEl.style.gridTemplateColumns = `repeat(${q.width}, 80px)`;
  gridEl.style.gridTemplateRows    = `repeat(${q.height},80px)`;
  
  // clear out old
  gridEl.innerHTML = '';
  
  // draw empty cells
  for (let y=0; y<q.height; y++){
    for (let x=0; x<q.width; x++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      gridEl.appendChild(cell);
    }
  }
  // draw pieces
  q.pieces.forEach(p => {
    const el = document.createElement('div');
    el.className = `piece ${p.type}`;
    // position via CSS grid + absolute overlay
    el.style.gridColumnStart = p.x+1;
    el.style.gridRowStart    = p.y+1;
    if (p.moveable) el.classList.add('draggable');
    gridEl.appendChild(el);
  });
}

// --- ANSWER / SKIP HANDLERS ---
function answerPuzzle(skipped) {
  attempted++;
  current++;
  if (current >= questions.length) return finishTest();
  renderCurrentPuzzle();
}

// --- FINISH TEST ---
function finishTest() {
  clearInterval(timerId);
  alert(`Time’s up! You attempted ${attempted} puzzles.`);
  location.reload();
}
