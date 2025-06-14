// complex-planning/app.js

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('instructions-overlay');
  const startBtn = document.getElementById('start-test');
  const gridContainer = document.getElementById('grid');
  const timerEl = document.getElementById('timer');
  const attemptedEl = document.getElementById('attempted');
  const nextBtn = document.getElementById('nextBtn');
  const skipBtn = document.getElementById('skipBtn');

  let questions = [];
  let current = 0;
  let attempted = 0;
  let timeLeft = 360;       // 6 minutes in seconds
  let timerInterval = null;

  // Load puzzles JSON
  fetch('./questions.json')
    .then(res => res.json())
    .then(data => {
      questions = data;
    })
    .catch(() => {
      alert('Failed to load test. Please check your network/JSON file.');
    });

  // Start the test
  startBtn.addEventListener('click', () => {
    overlay.style.display = 'none';
    document.body.classList.remove('no-scroll');
    startTimer();
    loadQuestion(current);
  });

  // Next and Skip buttons
  nextBtn.addEventListener('click', () => advanceQuestion());
  skipBtn.addEventListener('click', () => advanceQuestion());

  function advanceQuestion() {
    attempted++;
    updateAttempted();
    current++;
    if (current >= questions.length) return endTest();
    loadQuestion(current);
  }

  // Timer
  function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) return endTest();
      updateTimerDisplay();
    }, 1000);
  }
  function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60);
    const s = timeLeft % 60;
    timerEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  }

  function updateAttempted() {
    attemptedEl.textContent = `Attempted: ${attempted}`;
  }

  // Load and render a single puzzle
  function loadQuestion(idx) {
    const q = questions[idx];
    if (!q) return endTest();

    // Clear and size the grid
    gridContainer.innerHTML = '';
    gridContainer.style.gridTemplateColumns = `repeat(${q.width}, 80px)`;
    gridContainer.style.gridTemplateRows    = `repeat(${q.height}, 80px)`;

    // Create empty cells
    for (let y=0; y<q.height; y++) {
      for (let x=0; x<q.width; x++) {
        const cell = document.createElement('div');
        cell.className = 'grid-cell';
        gridContainer.appendChild(cell);
      }
    }

    // Place pieces
    q.pieces.forEach(p => {
      const el = document.createElement('div');
      el.className = `piece ${p.type}${p.moveable ? ' moveable' : ''}`;
      el.style.gridColumnStart = p.x + 1;
      el.style.gridRowStart    = p.y + 1;
      gridContainer.appendChild(el);
      if (p.moveable) {
        el.draggable = true;
        el.addEventListener('dragstart', onDragStart);
      }
    });
  }

  let draggedEl = null;
  function onDragStart(e) {
    draggedEl = e.target;
    // disable native ghost image
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  }

  // Simplest “drop anywhere” handler
  gridContainer.addEventListener('dragover', e => e.preventDefault());
  gridContainer.addEventListener('drop', e => {
    e.preventDefault();
    if (!draggedEl) return;
    const rect = gridContainer.getBoundingClientRect();
    // determine cell size
    const cellW = rect.width / (+draggedEl.parentNode.style.gridTemplateColumns.split(' ').length);
    const cellH = rect.height / (+draggedEl.parentNode.style.gridTemplateRows.split(' ').length);
    const x = Math.floor((e.clientX - rect.left) / cellW);
    const y = Math.floor((e.clientY - rect.top)  / cellH);
    // snap the piece
    draggedEl.style.gridColumnStart = Math.max(1, Math.min(x+1, +draggedEl.parentNode.style.gridTemplateColumns.split(' ').length));
    draggedEl.style.gridRowStart    = Math.max(1, Math.min(y+1, +draggedEl.parentNode.style.gridTemplateRows.split(' ').length));
    draggedEl = null;
  });

  function endTest() {
    clearInterval(timerInterval);
    alert(`Time’s up! You attempted ${attempted} puzzles.`);
    // Here you could redirect or render a results page
    window.location.href = '/';
  }
});
