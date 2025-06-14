// complex-planning/app.js

// map any generic block names in your JSON to the real CSS classes
const TYPE_MAP = {
  block0: "blueBlock",
  block1: "greenBlock",
  block2: "yellowBlock",
  block3: "orangeBlock",
  block4: "greyBlock",
  // leave redBall & exitHole untouched if they appear
};

let puzzles = [];
let currentIndex = 0;
let moves = 0;
let timerInterval;

// load all puzzles
fetch("questions.json")
  .then((r) => r.json())
  .then((data) => {
    puzzles = data;
    showInstructions();
  })
  .catch((err) => {
    alert("Failed to load test. Please check your network/JSON file.");
  });

// show the instructions overlay
function showInstructions() {
  const overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="instructions navy-header">
      <img src="logo-header.png" alt="999 Recruitment Ready" class="logo">
      <h2>Complex Planning Capability – motionChallenge</h2>
      <p>This test measures your ability to think ahead to solve puzzles. You have <strong>6 minutes</strong> to complete as many as you can.</p>
      <ol>
        <li>You can <strong>drag</strong> each block up/down or left/right to create a path for the red ball.</li>
        <li>Each move is counted; work carefully.</li>
        <li>If you get stuck, press <strong>Skip</strong> (counts as incorrect).</li>
        <li>When the red ball reaches the black hole, press <strong>Next</strong>.</li>
      </ol>
      <button id="startBtn">Start Test</button>
    </div>
  `;
  document.body.appendChild(overlay);
  document.getElementById("startBtn").onclick = () => {
    overlay.remove();
    startTest();
  };
}

// main test startup
function startTest() {
  startTimer(6 * 60);
  loadPuzzle(currentIndex);
}

// timer
function startTimer(seconds) {
  const display = document.getElementById("timer");
  let remaining = seconds;
  timerInterval = setInterval(() => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    display.textContent = `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
    if (--remaining < 0) {
      clearInterval(timerInterval);
      showResults();
    }
  }, 1000);
}

// draw a puzzle grid + pieces
function loadPuzzle(idx) {
  moves = 0;
  document.getElementById("attempted").textContent = idx;
  const { width, height, pieces } = puzzles[idx];
  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  // build empty grid
  grid.style.setProperty("--cols", width);
  grid.style.setProperty("--rows", height);
  for (let i = 0; i < width * height; i++) {
    grid.appendChild(document.createElement("div"));
  }

  // place each piece
  pieces.forEach((p) => {
    const type = TYPE_MAP[p.type] || p.type;
    const el = document.createElement("div");
    el.className = `piece ${type}`;
    el.style.left = `${p.x * (100 / width)}%`;
    el.style.top = `${p.y * (100 / height)}%`;
    if (p.moveable) {
      makeDraggable(el, width, height);
    }
    grid.appendChild(el);
  });
}

// draggable logic (basic)
function makeDraggable(el, cols, rows) {
  let startX, startY;
  el.onmousedown = (e) => {
    startX = e.clientX;
    startY = e.clientY;
    document.onmousemove = onDrag;
    document.onmouseup = endDrag;
  };
  function onDrag(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    // only move along one axis: whichever is larger
    if (Math.abs(dx) > Math.abs(dy)) {
      el.style.transform = `translateX(${Math.sign(dx) * 100 / cols}%)`;
    } else {
      el.style.transform = `translateY(${Math.sign(dy) * 100 / rows}%)`;
    }
  }
  function endDrag(e) {
    document.onmousemove = null;
    document.onmouseup = null;
    // snap into place
    const style = window.getComputedStyle(el);
    const left = parseFloat(style.left);
    const top = parseFloat(style.top);
    const trans = style.transform.match(/matrix.*\((.+)\)/);
    let tx = 0, ty = 0;
    if (trans) {
      const vals = trans[1].split(",").map(Number);
      tx = vals[4];
      ty = vals[5];
    }
    // detect direction: if |tx| > |ty|, move in x; else y
    let newX = Math.round((left + tx) / (100 / cols));
    let newY = Math.round((top + ty) / (100 / rows));
    newX = Math.max(0, Math.min(cols - 1, newX));
    newY = Math.max(0, Math.min(rows - 1, newY));
    el.style.left = `${newX * (100 / cols)}%`;
    el.style.top = `${newY * (100 / rows)}%`;
    el.style.transform = "";
    moves++;
    checkWin();
  }
}

// check if redBall is on exitHole
function checkWin() {
  const ball = document.querySelector(".piece.redBall");
  const hole = document.querySelector(".piece.exitHole");
  if (ball && hole) {
    const b = ball.getBoundingClientRect();
    const h = hole.getBoundingClientRect();
    if (b.left === h.left && b.top === h.top) {
      document.getElementById("nextBtn").disabled = false;
    }
  }
}

// skip & next buttons
document.getElementById("skipBtn").onclick = () => {
  recordResult(false);
  advance();
};
document.getElementById("nextBtn").onclick = () => {
  recordResult(true);
  advance();
};

const results = [];
function recordResult(won) {
  results.push({
    id: puzzles[currentIndex].id,
    success: won,
    moves: won ? moves : null,
  });
}

function advance() {
  currentIndex++;
  if (currentIndex >= puzzles.length) {
    clearInterval(timerInterval);
    showResults();
  } else {
    loadPuzzle(currentIndex);
    document.getElementById("nextBtn").disabled = true;
  }
}

// final results screen
function showResults() {
  // replace body with results summary
  document.body.innerHTML = `
    <div class="results">
      <h2>Test Complete</h2>
      <p>You attempted ${results.length} puzzles.</p>
      <p>Correct: ${results.filter(r => r.success).length}</p>
      <p>Skipped/Incorrect: ${results.filter(r => !r.success).length}</p>
      <button onclick="location.reload()">Retake Test</button>
      <button onclick="location.href='/'">Home</button>
    </div>
  `;
}

