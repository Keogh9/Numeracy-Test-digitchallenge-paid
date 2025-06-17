// --- DATA SETUP ---
const sections = [
  { 
    key: 'fluency',
    title: 'Fluency Skills',
    duration: 240,
    questions: [
     {
  id: 'f1',
  prompt: 'They relocated to Canada ____ the early seventies.',
  options: ['in', 'at', 'during', 'on', '?'],
  correct: 'during',
  rationale: 'We say “during the early seventies” to refer to that period.'
},
{
  id: 'f2',
  prompt: 'Unless you ____ action soon, the opportunity will be lost.',
  options: ['take', 'took', 'taken', 'taking', '?'],
  correct: 'take',
  rationale: 'First conditional uses base verb after “unless”—“unless you take action.”'
},
        {
    id: 'f3',
    prompt: 'She’s used to ____ up early every morning.',
    options: ['getting', 'to get', 'get', 'having gotten', '?'],
    correct: 'getting',
    rationale: '“used to” is followed by a gerund (-ing form).'
  },
  {
    id: 'f4',
    prompt: 'He apologized ____ arriving late.',
    options: ['for', 'to', 'at', 'with', '?'],
    correct: 'for',
    rationale: 'You “apologize for” an action or mistake.'
  },
  {
    id: 'f5',
    prompt: 'I can’t stand ____ in long lines.',
    options: ['to wait', 'waiting', 'wait', 'having waited', '?'],
    correct: 'waiting',
    rationale: '“can’t stand” takes an -ing form.'
  },
  {
    id: 'f6',
    prompt: 'They succeeded ____ securing the contract.',
    options: ['in', 'at', 'on', 'to', '?'],
    correct: 'in',
    rationale: 'You “succeed in” doing something.'
  },
  {
    id: 'f7',
    prompt: 'We are committed ____ reducing our carbon footprint.',
    options: ['in', 'to', 'for', 'on', '?'],
    correct: 'to',
    rationale: '“committed to” expresses dedication to an action.'
  },
  {
    id: 'f8',
    prompt: 'If I ____ you, I would take the job.',
    options: ['was', 'were', 'am', 'would be', '?'],
    correct: 'were',
    rationale: 'Second-conditional “if I were … I would …”.'
  },
  {
    id: 'f9',
    prompt: 'He’s considering ____ to Australia next year.',
    options: ['move', 'moving', 'to move', 'having moved', '?'],
    correct: 'moving',
    rationale: '“consider” is followed by a gerund.'
  },
  {
    id: 'f10',
    prompt: 'She denied ____ the money.',
    options: ['stealing', 'to steal', 'steal', 'stole', '?'],
    correct: 'stealing',
    rationale: '“deny” is followed by a gerund.'
  },
  {
    id: 'f11',
    prompt: 'The project will commence ____ approval from the board.',
    options: ['until', 'after', 'before', 'unless', '?'],
    correct: 'after',
    rationale: 'You “commence after” something has occurred.'
  },
  {
    id: 'f12',
    prompt: 'Unless we ____ now, we will be late.',
    options: ['leave', 'leaves', 'leaving', 'left', '?'],
    correct: 'leave',
    rationale: 'First conditional: “unless we leave now …”.'
  },
  {
    id: 'f13',
    prompt: 'She insisted ____ with the original plan.',
    options: ['on going', 'going', 'to go', 'go', '?'],
    correct: 'on going',
    rationale: '“insist on doing” requires “on” + gerund.'
  },
  {
    id: 'f14',
    prompt: 'He ended up ____ his resignation.',
    options: ['submitting', 'to submit', 'submit', 'having submitted', '?'],
    correct: 'submitting',
    rationale: '“end up” is followed by a gerund.'
  },
  {
    id: 'f15',
    prompt: 'I look forward to ____ you again.',
    options: ['seeing', 'see', 'to see', 'seen', '?'],
    correct: 'seeing',
    rationale: '“look forward to” takes a gerund.'
  },
  {
    id: 'f16',
    prompt: 'They postponed ____ the meeting until next week.',
    options: ['hold', 'to hold', 'holding', 'held', '?'],
    correct: 'holding',
    rationale: '“postpone” is followed by a gerund.'
  },
  {
    id: 'f17',
    prompt: 'She’s capable ____ handling the workload.',
    options: ['in', 'for', 'of', 'to', '?'],
    correct: 'of',
    rationale: 'You are “capable of” something.'
  },
  {
    id: 'f18',
    prompt: 'We need to focus ____ quality rather than quantity.',
    options: ['on', 'in', 'for', 'at', '?'],
    correct: 'on',
    rationale: 'You “focus on” a topic or goal.'
  },
  {
    id: 'f19',
    prompt: 'He was accused ____ fraud.',
    options: ['for', 'of', 'by', 'with', '?'],
    correct: 'of',
    rationale: 'You “accuse someone of” wrongdoing.'
  },
  {
    id: 'f20',
    prompt: 'It’s important ____ a backup plan.',
    options: ['to have', 'have', 'having', 'had', '?'],
    correct: 'to have',
    rationale: '“important to do” uses the infinitive.'
  }
      {
  id: 'f21',
  prompt: 'She managed to finish the report ____ the tight deadline.',
  options: ['despite', 'although', 'even', 'in spite', '?'],
  correct: 'despite',
  rationale: 'Use “despite” + noun phrase to show contrast.'
},
{
  id: 'f22',
  prompt: 'I’m responsible ____ training new team members.',
  options: ['for', 'to', 'of', 'in', '?'],
  correct: 'for',
  rationale: '“Responsible for” indicates duty or obligation.'
},
{
  id: 'f23',
  prompt: 'He promised ____ the documents by Friday.',
  options: ['to send', 'sending', 'sent', 'send', '?'],
  correct: 'to send',
  rationale: '“Promise” is followed by the infinitive form.'
},
{
  id: 'f24',
  prompt: 'They congratulated her ____ winning the award.',
  options: ['on', 'for', 'about', 'with', '?'],
  correct: 'on',
  rationale: 'You “congratulate someone on” their achievement.'
},
{
  id: 'f25',
  prompt: 'If she ____ harder, she would have passed the exam.',
  options: ['studied', 'had studied', 'studies', 'would study', '?'],
  correct: 'had studied',
  rationale: 'Third conditional: “if she had studied … would have …”.'
},
{
  id: 'f26',
  prompt: 'We decided ____ early to avoid rush-hour traffic.',
  options: ['to leave', 'leaving', 'left', 'leave', '?'],
  correct: 'to leave',
  rationale: '“Decide” is followed by the infinitive.'
},
{
  id: 'f27',
  prompt: 'I can’t help ____ when I hear that song.',
  options: ['smile', 'smiling', 'to smile', 'smiled', '?'],
  correct: 'smiling',
  rationale: '“Can’t help” takes the -ing form.'
},
{
  id: 'f28',
  prompt: 'She looks forward ____ her promotion.',
  options: ['to', 'for', 'at', 'in', '?'],
  correct: 'to',
  rationale: '“Look forward to” uses “to” + noun/gerund.'
},
{
  id: 'f29',
  prompt: 'They agreed ____ the meeting until next week.',
  options: ['to postpone', 'postponing', 'postpone', 'having postponed', '?'],
  correct: 'to postpone',
  rationale: '“Agree” is followed by the infinitive.'
},
{
  id: 'f30',
  prompt: 'He’s keen ____ improving his presentation skills.',
  options: ['on', 'in', 'about', 'at', '?'],
  correct: 'on',
  rationale: '“Keen on” means enthusiastic about something.'
}
    ]
  },
  { 
    key: 'vocab',
    title: 'Vocabulary Skills',
    duration: 240,
    questions: [
      { id:'v1', prompt:'a very small baby', 
        options:['newborn','native','giant','chairman'], correct:'newborn', 
        rationale:"'Newborn' means recently born baby." },
      { id:'v2', prompt:'living in nature', 
        options:['employee','mild','wild','corporate'], correct:'wild', 
        rationale:"'Wild' means living in natural state." },
      { id:'v3', prompt:'a short, amusing story', 
        options:['anecdote','antidote','allocate','aggregate'], correct:'anecdote', 
        rationale:"An 'anecdote' is a brief entertaining story." },
      { id:'v4', prompt:'material supplied; nourishment', 
        options:['feed','folder','breadth','town'], correct:'feed', 
        rationale:"'Feed' as a noun means food or nourishment." }
    ]
  },
  { 
    key: 'spelling',
    title: 'Spelling Skills',
    duration: 120,
    questions: [
      { id:'s1', prompt:'Correct spelling for “person in charge”', 
        options:['manager','mannager'], correct:'manager', 
        rationale:"'Manager' has one 'n'." },
      { id:'s2', prompt:'Correct spelling for corporate entity', 
        options:['compeny','company'], correct:'company', 
        rationale:"'Company' has 'any' after 'comp'." },
      { id:'s3', prompt:'Correct spelling meaning “too valuable to price”', 
        options:['priceless','prizeless'], correct:'priceless', 
        rationale:"'Priceless' is spelled with a 'c'." },
      { id:'s4', prompt:'Correct spelling: agreement to recommend again', 
        options:['recommend','reccommend'], correct:'recommend', 
        rationale:"'Recommend' has one 'c', two 'm's." }
    ]
  }
];

// --- STATE ---
let currentSection   = 0;
let questionList     = [];
let currentQuestion  = 0;
let timeLeft         = 0;
let timerInterval;
const userAnswers    = {};

// --- DOM ELEMENTS ---
const instr   = document.getElementById('instructions');
const testA   = document.getElementById('test-area');
const resultA = document.getElementById('results-area');
const timerD  = document.getElementById('timer');
const startB  = document.getElementById('start-btn');
const nextB   = document.getElementById('next-btn');
const titleH  = document.getElementById('section-title');
const quesD   = document.getElementById('questions');
const resD    = document.getElementById('results');

// --- HELPERS ---
function showPanel(panel) {
  instr.classList.add('hidden');
  testA.classList.add('hidden');
  resultA.classList.add('hidden');
  panel.classList.remove('hidden');
}

function updateTimerDisplay() {
  const m = String(Math.floor(timeLeft/60)).padStart(2,'0');
  const s = String(timeLeft % 60).padStart(2,'0');
  timerD.textContent = `${m}:${s}`;
}

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

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// --- RENDERING ---
function initSection() {
  const sec = sections[currentSection];
  questionList = shuffle(sec.questions.slice());
  currentQuestion = 0;
  showPanel(testA);
  renderQuestion();
  startTimer(sec.duration, nextSection);
}

function renderQuestion() {
  const q = questionList[currentQuestion];
  const sec = sections[currentSection];
  titleH.textContent = `${sec.title} (${Math.ceil(sec.duration/60)} min)`;
  quesD.innerHTML = '';

  const wrapper = document.createElement('div');
  wrapper.className = 'question';
  const p = document.createElement('p');
  p.textContent = q.prompt;
  wrapper.appendChild(p);

  // Build options + skip
  q.options.concat('?').forEach(opt => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="radio" name="choice" value="${opt}"> ${opt}`;
    label.querySelector('input').addEventListener('change', () => handleSelect(opt));
    wrapper.appendChild(label);
  });

  quesD.appendChild(wrapper);
}

// --- FLOW CONTROL ---
function handleSelect(opt) {
  const q = questionList[currentQuestion];
  userAnswers[q.id] = opt;

  if (currentQuestion < questionList.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    clearInterval(timerInterval);
    nextSection();
  }
}

function nextSection() {
  currentSection++;
  if (currentSection < sections.length) {
    initSection();
  } else {
    showResults();
  }
}

// --- RESULTS ---
function showResults() {
  showPanel(resultA);
  resD.innerHTML = '';
  sections.forEach(sec => {
    sec.questions.forEach(q => {
      const ua = userAnswers[q.id] || '?';
      const correct = ua === q.correct;
      const div = document.createElement('div');
      div.className = ua === '?'
        ? 'result-skipped'
        : correct
        ? 'result-correct'
        : 'result-incorrect';

      div.innerHTML = `
        <p><strong>${q.prompt}</strong></p>
        <p>Your answer: ${ua}</p>
        <p>Correct answer: <strong>${q.correct}</strong></p>
        ${
          ua === '?'
            ? `<em>You skipped this question.</em>`
            : !correct
            ? `<em>Rationale: ${q.rationale}</em>`
            : ''
        }
      `;
      resD.appendChild(div);
    });
  });
  timerD.textContent = '';
}

// --- EVENT LISTENERS ---
startB.addEventListener('click', () => {
  showPanel(testA);
  initSection();
});

nextB.addEventListener('click', () => {
  clearInterval(timerInterval);
  nextSection();
});

