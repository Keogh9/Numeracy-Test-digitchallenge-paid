// --- State ---
let questions = [];
let current = 0;
let timerId, timeLeft = 360; // seconds
let attempted = 0, correct = 0, totalMoves = 0;
let moveCount = 0;

// --- Helpers ---
const $ = id => document.getElementById(id);

// Load JSON
fetch('./questions.json')
  .then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  })
  .catch(err => {
    console.error('could not load questions.json:', err);
    alert('Failed to load test. Please check your network/JSON file.');
  })

// Show instructions overlay
function showOverlay() {
  $('overlay').classList.remove('hidden');
  $('testArea').classList.add('hidden');
  $('resultsOverlay').classList.add('hidden');
  resetState();
}

// Reset all counters
function resetState() {
  current = 0; timeLeft = 360;
  attempted = correct = totalMoves = 0;
  $('timer').textContent = formatTime(timeLeft);
  $('attempted').textContent = 'Attempted: 0';
}

// Format mm:ss
function formatTime(sec) {
  const m = Math.floor(sec/60).toString().padStart(2,'0'),
        s = (sec%60).toString().padStart(2,'0');
  return `${m}:${s}`;
}

// Start test
$('startBtn').onclick = () => {
  $('overlay').classList.add('hidden');
  $('testArea').classList.remove('hidden');
  renderQuestion();
  timerId = setInterval(() => {
    if (--timeLeft <= 0) endTest();
    $('timer').textContent = formatTime(timeLeft);
  }, 1000);
};

// End test
function endTest() {
  clearInterval(timerId);
  $('testArea').classList.add('hidden');
  $('resultsOverlay').classList.remove('hidden');
  $('rightCount').textContent = correct;
  $('totalCount').textContent = attempted;
  $('avgMoves').textContent = attempted ? Math.round(totalMoves/correct) : 0;
}

// Navigate home / retake
$('homeBtn').onclick = () => location.href = '/';
$('retakeBtn').onclick = () => showOverlay();

// Next / Skip
$('nextBtn').onclick = () => submitAnswer(true);
$('skipBtn').onclick = () => submitAnswer(false);

function submitAnswer(isNext) {
  attempted++;
  $('attempted').textContent = `Attempted: ${attempted}`;
  // Check success only on Next:
  if (isNext && isSolved()) {
    correct++;
    totalMoves += moveCount;
  }
  if (++current >= questions.length) {
    endTest();
  } else {
    renderQuestion();
  }
}

function isSolved() {
  const q = questions[current];
  const ball = q.pieces.find(p => p.type==='ball');
  return ball.row === q.exit.row && ball.col === q.exit.col;
}

// --- Rendering ---
function renderQuestion() {
  moveCount = 0;
  $('moveCounter').textContent = `Moves: ${moveCount}`;
  const q = questions[current];
  const grid = $('grid');
  grid.innerHTML = '';
  // Draw cells (optional grid-lines)
  for (let r=1; r<=q.grid.rows; r++){
    for (let c=1; c<=q.grid.cols; c++){
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.top = `${(r-1)*100}px`;
      cell.style.left = `${(c-1)*100}px`;
      grid.appendChild(cell);
    }
  }
  // Draw exit hole
  const exit = document.createElement('div');
  exit.className = 'exit';
  exit.style.top = `${(q.exit.row-0.5)*100}px`;
  exit.style.left = `${q.exit.col*100}px`;
  grid.appendChild(exit);
  // Draw pieces
  q.pieces.forEach(p => {
    const el = document.createElement('div');
    el.className = 'piece ' + p.type;
    el.dataset.id = p.id;
    // size & pos
    const w = p.type==='ball' ? 80 : (p.orientation==='horizontal' ? p.length*100 : 100);
    const h = p.type==='ball' ? 80 : (p.orientation==='vertical'   ? p.length*100 : 100);
    el.style.width = w+'px';
    el.style.height = h+'px';
    el.style.top = `${(p.row-1)*100 + (p.type==='ball'?10:0)}px`;
    el.style.left = `${(p.col-1)*100 + (p.type==='ball'?10:0)}px`;
    grid.appendChild(el);
    if (p.movable) makeDraggable(el, p);
  });
}

// Draggable logic
function makeDraggable(el, model) {
  let startX, startY;
  el.onpointerdown = ev => {
    ev.preventDefault();
    startX = ev.clientX;
    startY = ev.clientY;
    el.setPointerCapture(ev.pointerId);
  };
  el.onpointermove = ev => {
    if (!startX) return;
    const dx = ev.clientX - startX;
    const dy = ev.clientY - startY;
    const moveThreshold = 50; // half cell
    let moved = false;
    if (model.type==='bar') {
      // vertical slide
      if (model.orientation==='vertical' && Math.abs(dy)>moveThreshold) {
        if (dy>0) moved = attemptMove(model, +1,0);
        else      moved = attemptMove(model, -1,0);
        startY = ev.clientY;
      }
      // horizontal slide
      if (model.orientation==='horizontal' && Math.abs(dx)>moveThreshold) {
        if (dx>0) moved = attemptMove(model,0,+1);
        else      moved = attemptMove(model,0,-1);
        startX = ev.clientX;
      }
    }
    if (model.type==='ball' && Math.abs(dx)>moveThreshold && Math.abs(dx)>Math.abs(dy)) {
      // allow ball to slide horizontally only
      if (dx>0) moved = attemptMove(model,0,+1);
      else      moved = attemptMove(model,0,-1);
      startX = ev.clientX;
    }
    if (moved) {
      moveCount++;
      $('moveCounter').textContent = `Moves: ${moveCount}`;
    }
  };
  el.onpointerup = ev => {
    el.releasePointerCapture(ev.pointerId);
    startX = startY = null;
  };
}

// Try to move model by dr/ dc = ±1 cell; returns true on success
function attemptMove(m, dr, dc) {
  const q = questions[current],
        pieces = q.pieces,
        newRow = m.row + dr,
        newCol = m.col + dc;
  // boundaries
  if (newRow<1 || newCol<1) return false;
  if (m.orientation==='vertical' && newRow + m.length -1 > q.grid.rows) return false;
  if (m.orientation==='horizontal' && newCol + m.length -1 > q.grid.cols) return false;
  // detect overlap
  const cells = [];
  for (let r=newRow; r<newRow + (m.orientation==='vertical'?m.length:1); r++){
    for (let c=newCol; c<newCol + (m.orientation==='horizontal'?m.length:1); c++){
      cells.push(`${r},${c}`);
    }
  }
  for (let other of pieces) {
    if (other.id===m.id) continue;
    for (let rr=other.row; rr<(other.row + (other.orientation==='vertical'?other.length:1)); rr++){
      for (let cc=other.col; cc<(other.col + (other.orientation==='horizontal'?other.length:1)); cc++){
        if (cells.includes(`${rr},${cc}`)) return false;
      }
    }
  }
  // commit move
  m.row = newRow;
  m.col = newCol;
  // re-render that piece
  const el = document.querySelector(`.piece[data-id="${m.id}"]`);
  el.style.top  = `${(m.row-1)*100 + (m.type==='ball'?10:0)}px`;
  el.style.left = `${(m.col-1)*100 + (m.type==='ball'?10:0)}px`;
  return true;
}
