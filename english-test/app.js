// --- DATA SETUP ---
const sections = [
  {
    key: 'fluency',
    title: 'Fluency Skills',
    duration: 240,
    questions: [
      { id:'f1', prompt:'Where did you get the money ____?', options:['for','out','from','away'], correct:'from', rationale:"‘Get money from’ indicates source." },
      { id:'f2', prompt:'If ____ snowing, we will go skiing.', options:['will','it is','it was','it will'], correct:'it is', rationale:"First conditional: 'if it is snowing'." },
      { id:'f3', prompt:'I offered several times, but ____ was interested.', options:['nobody','anybody','someone','everybody'], correct:'nobody', rationale:"Negative context needs 'nobody'." },
      { id:'f4', prompt:'____ knows what the future holds.', options:['Anybody','Nobody','Somebody','Everybody'], correct:'Nobody', rationale:"'Nobody knows' expresses uncertainty." }
    ]
  },
  {
    key: 'vocab',
    title: 'Vocabulary Skills',
    duration: 240,
    questions: [
      { id:'v1', prompt:'a very small baby', options:['newborn','native','giant','chairman'], correct:'newborn', rationale:"'Newborn' means recently born baby." },
      { id:'v2', prompt:'living in nature', options:['employee','mild','wild','corporate'], correct:'wild', rationale:"'Wild' means living in natural state." },
      { id:'v3', prompt:'a short, amusing story', options:['anecdote','antidote','allocate','aggregate'], correct:'anecdote', rationale:"An 'anecdote' is a brief entertaining story." },
      { id:'v4', prompt:'material supplied; nourishment', options:['feed','folder','breadth','town'], correct:'feed', rationale:"'Feed' as a noun means food or nourishment." }
    ]
  },
  {
    key: 'spelling',
    title: 'Spelling Skills',
    duration: 120,
    questions: [
      { id:'s1', prompt:'Correct spelling for “person in charge”', options:['manager','mannager'], correct:'manager', rationale:"'Manager' has one 'n'." },
      { id:'s2', prompt:'Correct spelling for corporate entity', options:['compeny','company'], correct:'company', rationale:"'Company' has 'any' after 'comp'." },
      { id:'s3', prompt:'Correct spelling meaning “too valuable to price”', options:['priceless','prizeless'], correct:'priceless', rationale:"'Priceless' is spelled with a 'c'." },
      { id:'s4', prompt:'Correct spelling: agreement to recommend again', options:['recommend','reccommend'], correct:'recommend', rationale:"'Recommend' has one 'c', two 'm's." }
    ]
  }
];

// --- STATE ---
let currentSection = 0;
let timeLeft = sections[0].duration;
let userAnswers = {};

// --- ELEMENTS ---
const instr  = document.getElementById('instructions');
const testA  = document.getElementById('test-area');
const resultA= document.getElementById('results-area');
const timerD = document.getElementById('timer');
const startB = document.getElementById('start-btn');
const nextB  = document.getElementById('next-btn');
const titleH = document.getElementById('section-title');
const quesD  = document.getElementById('questions');
const resD   = document.getElementById('results');

let timerInterval;

// Utility to switch panels
function showPanel(panel) {
  instr.classList.add('hidden');
  testA.classList.add('hidden');
  resultA.classList.add('hidden');
  panel.classList.remove('hidden');
}

// Timer logic
function startTimer(duration, onExpire) {
  timeLeft = duration;
  updateTimerDisplay();
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      onExpire();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const m = String(Math.floor(timeLeft / 60)).padStart(2,'0');
  const s = String(timeLeft % 60).padStart(2,'0');
  timerD.textContent = `${m}:${s}`;
}

// Shuffle helper
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Render current section questions
function renderQuestions() {
  const sec = sections[currentSection];
  titleH.textContent = `${sec.title} (${Math.ceil(sec.duration/60)} min)`;
  quesD.innerHTML = '';
  const qs = shuffle(sec.questions.slice());
  qs.forEach(q => {
    const div = document.createElement('div');
    div.className = 'question';
    div.innerHTML = `<p>${q.prompt}</p>`;
    q.options.concat('?').forEach(opt => {
      const id = `${q.id}_${opt}`;
      const label = document.createElement('label');
      label.innerHTML = `<input type="radio" name="${q.id}" value="${opt}" id="${id}"/> ${opt}`;
      div.appendChild(label);
    });
    quesD.appendChild(div);
  });
}

// Move to next section or results
function nextSection() {
  // Save answers
  sections[currentSection].questions.forEach(q => {
    const sel = document.querySelector(`input[name="${q.id}"]:checked`);
    userAnswers[q.id] = sel ? sel.value : '?';
  });

  currentSection++;
  if (currentSection < sections.length) {
    showPanel(testA);
    renderQuestions();
    startTimer(sections[currentSection].duration, nextSection);
  } else {
    showResults();
  }
}

// Show results
function showResults() {
  showPanel(resultA);
  resD.innerHTML = '';
  sections.flatMap(s => s.questions).forEach(q => {
    const ua = userAnswers[q.id];
    const isCorrect = ua === q.correct;
    const div = document.createElement('div');
    div.className = ua === '?'
      ? 'result-skipped'
      : isCorrect
      ? 'result-correct'
      : 'result-incorrect';
    div.innerHTML = `
      <p><strong>${q.prompt}</strong></p>
      <p>Your answer: ${ua}</p>
      <p>Correct answer: <strong>${q.correct}</strong></p>
      ${!isCorrect && ua !== '?' ? `<em>Rationale: ${q.rationale}</em>` : ''}
      ${ua === '?' ? `<em>You skipped this question.</em>` : ''}
    `;
    resD.appendChild(div);
  });
  timerD.textContent = '';
}

// Event hookups
startB.addEventListener('click', () => {
  showPanel(testA);
  renderQuestions();
  startTimer(sections[0].duration, nextSection);
});
nextB.addEventListener('click', () => {
  clearInterval(timerInterval);
  nextSection();
});
