// Strict mode
'use strict';

const QUESTIONS_URL = './questions.json';
let puzzles = [];
let currentIndex = 0;
let correctCount = 0;
let totalMoves = 0;
let timerInterval;
let timeLeft = 6 * 60; // 6 minutes in seconds

// DOM refs
const gridContainer = document.getElementById('grid-container');
const skipBtn = document.getElementById('skipBtn');
const nextBtn = document.getElementById('nextBtn');
const instrOverlay = document.getElementById('instructions');
const startBtn = document.getElementById('startTest');
const timerEl = document.getElementById('timer');
const attemptEl = document.getElementById('attempted');

// Results template
const resultsTpl = document.getElementById('results-template');

// Load puzzles.json
fetch(QUESTIONS_URL)
  .then(res => {
    if (!res.ok) throw new Error(res.status);
    return res.json();
  })
  .then(data => {
    puzzles = data;
  })
  .catch(err => {
    console.error('could not load JSON', err);
    alert('Failed to load test. Please check your network/JSON file.');
  });

// Start test
startBtn.addEventListener('click', () => {
  instrOverlay.style.display = 'none';
  startTimer();
  showPuzzle();
});

// Timer
function startTimer() {
  updateTimer();
  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showResults();
    } else {
      updateTimer();
    }
  }, 1000);
}
function updateTimer() {
  const min = String(Math.floor(timeLeft / 60)).padStart(2, '0');
  const sec = String(timeLeft % 60).padStart(2, '0');
  timerEl.textContent = `${min}:${sec}`;
}

// Show puzzle N
function showPuzzle() {
  if (currentIndex >= puzzles.length) {
    // wrap or end
    showResults();
    return;
  }
  const p = puzzles[currentIndex];
  attemptEl.textContent = `Attempted: ${currentIndex}`;
  renderGrid(p);
}

// Render grid + objects
function renderGrid(p) {
  gridContainer.innerHTML = '';
  // empty cells (for visual grid)
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      gridContainer.appendChild(cell);
    }
  }
  // exit-hole
  addBlock(p.exit.x, p.exit.y, 'exit-hole', true);
  // red-ball
  addBlock(p.red.x, p.red.y, 'red-ball', true);
  // fixed blocks
  p.fixed.forEach(b => addBlock(b.x, b.y, 'block fixed', false, b));
  // movable blocks
  p.movable.forEach(b => addBlock(b.x, b.y, 'block', true, b));
}

// factory to place blocks/balls
function addBlock(x, y, cls, draggable, meta) {
  const el = document.createElement('div');
  el.className = cls;
  // size & position
  const cellW = gridContainer.clientWidth / 3;
  const cellH = gridContainer.clientHeight / 5;
  if (meta && meta.orientation === 'horizontal') {
    el.style.width  = cellW * meta.length + 'px';
    el.style.height = cellH + 'px';
  } else {
    el.style.width  = cellW + 'px';
    el.style.height = cellH * (meta ? meta.length : 1) + 'px';
  }
  el.style.left   = x * cellW + 'px';
  el.style.top    = y * cellH + 'px';

  if (draggable && meta) {
    makeDraggable(el, meta.orientation);
  }
  gridContainer.appendChild(el);
}

// simple drag handler
function makeDraggable(el, orientation) {
  let startX, startY, origX, origY;
  const cellW = gridContainer.clientWidth / 3;
  const cellH = gridContainer.clientHeight / 5;

  el.addEventListener('mousedown', e => {
    startX = e.clientX; startY = e.clientY;
    origX  = parseFloat(el.style.left);
    origY  = parseFloat(el.style.top);
    document.addEventListener('mousemove', onDrag);
    document.addEventListener('mouseup', onDrop);
  });

  function onDrag(e) {
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    let newX = origX, newY = origY;

    if (orientation === 'horizontal') {
      newX = Math.round((origX + dx) / cellW) * cellW;
    } else {
      newY = Math.round((origY + dy) / cellH) * cellH;
    }
    // keep inside container
    newX = Math.max(0, Math.min(newX, gridContainer.clientWidth - el.clientWidth));
    newY = Math.max(0, Math.min(newY, gridContainer.clientHeight - el.clientHeight));
    el.style.left = newX + 'px';
    el.style.top  = newY + 'px';
  }

  function onDrop() {
    document.removeEventListener('mousemove', onDrag);
    document.removeEventListener('mouseup', onDrop);
    totalMoves++;
  }
}

// Next & Skip
nextBtn.addEventListener('click', () => { checkSuccess(); });
skipBtn.addEventListener('click', () => {
  currentIndex++;
  showPuzzle();
});

// Success check
function checkSuccess() {
  // see if red-ball overlaps exit-hole
  const rb = document.querySelector('.red-ball');
  const ex = document.querySelector('.exit-hole');
  const rbb = rb.getBoundingClientRect();
  const exb = ex.getBoundingClientRect();
  if (
    Math.abs(rbb.left - exb.left) < 2 &&
    Math.abs(rbb.top  - exb.top ) < 2
  ) {
    correctCount++;
  }
  currentIndex++;
  if (currentIndex >= puzzles.length) {
    showResults();
  } else {
    showPuzzle();
  }
}

// Show results overlay
function showResults() {
  clearInterval(timerInterval);
  const frag = resultsTpl.content.cloneNode(true);
  document.body.appendChild(frag);
  document.getElementById('scoreCorrect').textContent = correctCount;
  document.getElementById('scoreTotal').textContent   = currentIndex;
  document.getElementById('totalMoves').textContent   = totalMoves;
  document.getElementById('retakeBtn').onclick = () => location.reload();
  document.getElementById('homeBtn').onclick   = () => window.location.href = '/';
}
