// app.js

// --- INLINE QUESTIONS (10 puzzles) ---
const questions = [
  {
    id: 1, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:0, y:0, moveable:false},
      {type: 'exitHole', x:2, y:4, moveable:false},
      {type: 'blueBlock', x:1, y:0, moveable:true},
      {type: 'greenBlock',x:1, y:1, moveable:true},
      {type: 'greyBlock', x:0, y:1, moveable:false},
    ]
  },
  {
    id: 2, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:2, y:0, moveable:false},
      {type: 'exitHole', x:0, y:4, moveable:false},
      {type: 'blueBlock', x:0, y:0, moveable:true},
      {type: 'greenBlock',x:2, y:1, moveable:true},
      {type: 'greyBlock', x:1, y:0, moveable:false},
    ]
  },
  {
    id: 3, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:0, y:2, moveable:false},
      {type: 'exitHole', x:2, y:2, moveable:false},
      {type: 'blueBlock', x:1, y:2, moveable:true},
      {type: 'greenBlock',x:1, y:3, moveable:true},
      {type: 'greyBlock', x:0, y:1, moveable:false},
    ]
  },
  {
    id: 4, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:1, y:1, moveable:false},
      {type: 'exitHole', x:1, y:4, moveable:false},
      {type: 'blueBlock', x:0, y:1, moveable:true},
      {type: 'greenBlock',x:2, y:1, moveable:true},
      {type: 'greyBlock', x:1, y:0, moveable:false},
    ]
  },
  {
    id: 5, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:2, y:3, moveable:false},
      {type: 'exitHole', x:0, y:0, moveable:false},
      {type: 'blueBlock', x:1, y:3, moveable:true},
      {type: 'greenBlock',x:2, y:2, moveable:true},
      {type: 'greyBlock', x:2, y:1, moveable:false},
    ]
  },
  {
    id: 6, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:1, y:0, moveable:false},
      {type: 'exitHole', x:1, y:4, moveable:false},
      {type: 'blueBlock', x:0, y:0, moveable:true},
      {type: 'greenBlock',x:2, y:0, moveable:true},
      {type: 'greyBlock', x:1, y:1, moveable:false},
    ]
  },
  {
    id: 7, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:0, y:4, moveable:false},
      {type: 'exitHole', x:2, y:0, moveable:false},
      {type: 'blueBlock', x:1, y:4, moveable:true},
      {type: 'greenBlock',x:0, y:3, moveable:true},
      {type: 'greyBlock', x:1, y:3, moveable:false},
    ]
  },
  {
    id: 8, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:2, y:2, moveable:false},
      {type: 'exitHole', x:0, y:2, moveable:false},
      {type: 'blueBlock', x:1, y:2, moveable:true},
      {type: 'greenBlock',x:2, y:3, moveable:true},
      {type: 'greyBlock', x:2, y:1, moveable:false},
    ]
  },
  {
    id: 9, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:1, y:3, moveable:false},
      {type: 'exitHole', x:1, y:1, moveable:false},
      {type: 'blueBlock', x:0, y:3, moveable:true},
      {type: 'greenBlock',x:2, y:3, moveable:true},
      {type: 'greyBlock', x:1, y:2, moveable:false},
    ]
  },
  {
    id: 10, width: 3, height: 5,
    pieces: [
      {type: 'redBall', x:0, y:1, moveable:false},
      {type: 'exitHole', x:2, y:3, moveable:false},
      {type: 'blueBlock', x:1, y:1, moveable:true},
      {type: 'greenBlock',x:0, y:2, moveable:true},
      {type: 'greyBlock', x:2, y:2, moveable:false},
    ]
  }
];

// --- STATE ---
let current = 0;
let attempted = 0;
let timeLeft = 6 * 60; // seconds
let timerId;

// --- DOM ---
const overlay    = document.getElementById('overlay');
const startBtn   = document.getElementById('start-btn');
const game       = document.getElementById('game');
const grid       = document.getElementById('grid');
const skipBtn    = document.getElementById('skip-btn');
const nextBtn    = document.getElementById('next-btn');
const timerEl    = document.getElementById('timer');
const attemptedEl= document.getElementById('attempted');

// --- EVENT LISTENERS ---
startBtn.addEventListener('click', startTest);
skipBtn .addEventListener('click', () => answerAndAdvance());
nextBtn .addEventListener('click', () => answerAndAdvance());

// --- FUNCTIONS ---
function startTest() {
  overlay.classList.add('hidden');
  game.classList.remove('hidden');
  startTimer();
  render();
}

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

function render() {
  const q = questions[current];
  attemptedEl.textContent = `Attempted: ${attempted}`;
  // configure grid
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${q.width}, 4em)`;
  grid.style.gridTemplateRows    = `repeat(${q.height}, 4em)`;
  // draw cells
  for (let i=0; i<q.width*q.height; i++) {
    const cell = document.createElement('div');
    cell.className = 'cell';
    grid.appendChild(cell);
  }
  // draw pieces
  q.pieces.forEach(p => {
    const el = document.createElement('div');
    el.className = `piece ${p.type}`;
    el.style.gridColumnStart = p.x+1;
    el.style.gridRowStart    = p.y+1;
    grid.appendChild(el);
  });
  nextBtn.disabled = true;
  // check win on each render? Not draggable logic for now
  nextBtn.disabled = false;
}

function answerAndAdvance() {
  attempted++;
  current++;
  if (current >= questions.length) return finishTest();
  render();
}

function finishTest() {
  clearInterval(timerId);
  alert(`Time’s up! You attempted ${attempted} puzzles.`);
  location.reload();
}

