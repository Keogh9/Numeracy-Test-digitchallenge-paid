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
  },
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
},
key: 'vocab',
  title: 'Vocabulary Skills',
  duration: 240,
  questions: [
    {
      id: 'v1',
      prompt: 'Characterized by great energy and enthusiasm',
      options: ['vigorous', 'listless', 'tame', 'lethargic'],
      correct: 'vigorous',
      rationale: '"Vigorous" means strong, energetic.'
    },
    {
      id: 'v2',
      prompt: 'Of or relating to a pleasant smell',
      options: ['aromatic', 'pungent', 'fetid', 'rank'],
      correct: 'aromatic',
      rationale: '"Aromatic" describes a pleasant fragrance.'
    },
    {
      id: 'v3',
      prompt: 'Impossible to understand or interpret',
      options: ['incomprehensible', 'lucid', 'transparent', 'plain'],
      correct: 'incomprehensible',
      rationale: '"Incomprehensible" means not able to be understood.'
    },
    {
      id: 'v4',
      prompt: 'Feeling or showing sorrow; sad',
      options: ['lamentable', 'jubilant', 'exultant', 'elated'],
      correct: 'lamentable',
      rationale: '"Lamentable" means deserving of regret or sorrow.'
    },
    {
      id: 'v5',
      prompt: 'Lasting for a very short time',
      options: ['fleeting', 'enduring', 'permanent', 'everlasting'],
      correct: 'fleeting',
      rationale: '"Fleeting" describes something brief in duration.'
    },
    {
      id: 'v6',
      prompt: 'Able to withstand or recover quickly from difficult conditions',
      options: ['resilient', 'fragile', 'brittle', 'weak'],
      correct: 'resilient',
      rationale: '"Resilient" means tough and able to recover.'
    },
    {
      id: 'v7',
      prompt: 'Exemplarily virtuous or holy',
      options: ['pious', 'profane', 'impious', 'secular'],
      correct: 'pious',
      rationale: '"Pious" means devoutly religious.'
    },
    {
      id: 'v8',
      prompt: 'Marked by or expressing goodwill; kindly',
      options: ['benevolent', 'malevolent', 'hostile', 'cruel'],
      correct: 'benevolent',
      rationale: '"Benevolent" means kindly and charitable.'
    },
    {
      id: 'v9',
      prompt: 'Relating to or denoting a system where resources are owned jointly',
      options: ['communal', 'private', 'individual', 'exclusive'],
      correct: 'communal',
      rationale: '"Communal" means shared by a community.'
    },
    {
      id: 'v10',
      prompt: 'Inciting or causing people to rebel against authority',
      options: ['seditious', 'loyal', 'obedient', 'submissive'],
      correct: 'seditious',
      rationale: '"Seditious" means tending to stir up revolt.'
    },
    {
      id: 'v11',
      prompt: 'Displaying or having a disapproval of something',
      options: ['derisive', 'admiring', 'approving', 'praising'],
      correct: 'derisive',
      rationale: '"Derisive" means mocking or scornful.'
    },
    {
      id: 'v12',
      prompt: 'Excessively talkative in a rambling, roundabout manner',
      options: ['loquacious', 'laconic', 'taciturn', 'reserved'],
      correct: 'loquacious',
      rationale: '"Loquacious" means very talkative.'
    },
    {
      id: 'v13',
      prompt: 'Existing in thought or as an idea but not having a physical reality',
      options: ['abstract', 'concrete', 'tangible', 'palpable'],
      correct: 'abstract',
      rationale: '"Abstract" refers to ideas, not physical objects.'
    },
    {
      id: 'v14',
      prompt: 'Done or shown openly; plainly or readily apparent',
      options: ['overt', 'covert', 'hidden', 'secret'],
      correct: 'overt',
      rationale: '"Overt" means open and observable.'
    },
    {
      id: 'v15',
      prompt: 'Occurring or existing prior to a particular time',
      options: ['precedent', 'subsequent', 'later', 'following'],
      correct: 'precedent',
      rationale: '"Precedent" indicates something earlier.'
    },
    {
      id: 'v16',
      prompt: 'Easily understood; completely intelligible or comprehensible',
      options: ['pellucid', 'murky', 'opaque', 'vague'],
      correct: 'pellucid',
      rationale: '"Pellucid" means crystal clear in meaning.'
    },
    {
      id: 'v17',
      prompt: 'Excessive pride or self-confidence',
      options: ['hubris', 'humility', 'modesty', 'diffidence'],
      correct: 'hubris',
      rationale: '"Hubris" means arrogant overconfidence.'
    },
    {
      id: 'v18',
      prompt: 'Tending to find fault or raise petty objections',
      options: ['carping', 'complimentary', 'laudatory', 'praising'],
      correct: 'carping',
      rationale: '"Carping" means persistently petty criticism.'
    },
    {
      id: 'v19',
      prompt: 'Performing acts of kindness or charity',
      options: ['philanthropic', 'selfish', 'greedy', 'avaricious'],
      correct: 'philanthropic',
      rationale: '"Philanthropic" means charitable, giving.'
    },
    {
      id: 'v20',
      prompt: 'Impossible to negotiate with or appease',
      options: ['implacable', 'placable', 'yielding', 'compliant'],
      correct: 'implacable',
      rationale: '"Implacable" means relentless, unyielding.'
    },
    {
      id: 'v21',
      prompt: 'Having or showing great knowledge or learning',
      options: ['erudite', 'ignorant', 'unlettered', 'uninformed'],
      correct: 'erudite',
      rationale: '"Erudite" means scholarly, learned.'
    },
    {
      id: 'v22',
      prompt: 'A person who dislikes humankind and avoids human society',
      options: ['misanthrope', 'philanthropist', 'extrovert', 'socialite'],
      correct: 'misanthrope',
      rationale: '"Misanthrope" means someone who hates people.'
    },
    {
      id: 'v23',
      prompt: 'Occurring or existing at the same time',
      options: ['concurrent', 'sequential', 'successive', 'serial'],
      correct: 'concurrent',
      rationale: '"Concurrent" means happening together.'
    },
    {
      id: 'v24',
      prompt: 'An overwhelming feeling of great happiness or joyful excitement',
      options: ['euphoria', 'misery', 'despair', 'dejection'],
      correct: 'euphoria',
      rationale: '"Euphoria" is intense joy or happiness.'
    },
    {
      id: 'v25',
      prompt: 'Concerned with beauty or the appreciation of beauty',
      options: ['aesthetic', 'utilitarian', 'pragmatic', 'functional'],
      correct: 'aesthetic',
      rationale: '"Aesthetic" relates to artistic beauty.'
    },
    {
      id: 'v26',
      prompt: 'Loud and harsh; grating',
      options: ['raucous', 'melodious', 'sweet', 'euphonious'],
      correct: 'raucous',
      rationale: '"Raucous" describes a harsh, loud sound.'
    },
    {
      id: 'v27',
      prompt: 'Tending to induce drowsiness or sleep',
      options: ['sedative', 'stimulating', 'invigorating', 'energizing'],
      correct: 'sedative',
      rationale: '"Sedative" means calming and sleep-inducing.'
    },
    {
      id: 'v28',
      prompt: 'Not revealing one’s thoughts or feelings readily',
      options: ['reticent', 'talkative', 'forthcoming', 'open'],
      correct: 'reticent',
      rationale: '"Reticent" means reserved or reluctant to speak.'
    },
    {
      id: 'v29',
      prompt: 'Having no serious purpose or value; silly',
      options: ['frivolous', 'grave', 'solemn', 'earnest'],
      correct: 'frivolous',
      rationale: '"Frivolous" means lighthearted and trivial.'
    },
    {
      id: 'v30',
      prompt: 'Marked by lack of interest, energy, or spirit',
      options: ['listless', 'animated', 'spirited', 'energetic'],
      correct: 'listless',
      rationale: '"Listless" means lacking energy or enthusiasm.'
    },
  ]
};
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
