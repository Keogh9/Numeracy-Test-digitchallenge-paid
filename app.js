document.addEventListener('DOMContentLoaded', () => {
  // Element refs…
  const instrOvl = document.getElementById('instructions-overlay');
  const testEl   = document.getElementById('test-container');
  const resOvl   = document.getElementById('results-container');
  const startBtn = document.getElementById('start-btn');
  const prevBtn  = document.getElementById('prev-btn');
  const nextBtn  = document.getElementById('next-btn');
  const clearBtn = document.getElementById('clear-btn');
  const retakeBtn= document.getElementById('retake-btn');
  const eqDiv    = document.getElementById('equation');
  const padDiv   = document.getElementById('digit-pad');
  const timerDiv = document.getElementById('timer');
  const curSpan  = document.getElementById('current');
  const totSpan  = document.getElementById('total');
  const scoreSp  = document.getElementById('score');
  const totQSp   = document.getElementById('total-questions');
  const pctSp    = document.getElementById('percent');
  const resList  = document.getElementById('results-list');

  let bank = [], quiz = [], answers = [], current = 0, timerId;

  // 1) Load your 300-item bank & pick 10
  fetch('questions.json')
    .then(r => r.json())
    .then(qs => {
      bank = qs;
      quiz = shuffle(qs).slice(0, 10);
      totSpan.textContent  = quiz.length;
      totQSp.textContent   = quiz.length;
    });

  // 2) Button wiring
  startBtn.onclick  = () => { instrOvl.style.display='none'; render(); startTimer(300); };
  prevBtn.onclick   = () => changeQ(-1);
  nextBtn.onclick   = () => changeQ(1);
  clearBtn.onclick  = () => clearLast();
  retakeBtn.onclick = () => location.reload();

  // 3) Timer
  function startTimer(sec) {
    let t = sec;
    timerDiv.textContent = fmt(t);
    timerId = setInterval(() => {
      t--; timerDiv.textContent = fmt(t);
      if (t <= 0) { clearInterval(timerId); finish(); }
    }, 1000);
  }
  function fmt(s) {
    const m = String(Math.floor(s/60)).padStart(2,'0');
    const ss= String(s%60).padStart(2,'0');
    return `${m}:${ss}`;
  }

  // 4) Render & navigation
  function render() {
    const q = quiz[current];
    eqDiv.innerHTML = '';
    padDiv.innerHTML= '';
    curSpan.textContent = current+1;
    // Build blanks
    let idx=0;
    q.expr.split(/(__)/g).forEach(p => {
      if (p==='__') {
        const sp = document.createElement('span');
        sp.className='blank'; sp.dataset.i=idx;
        sp.textContent = (answers[current]?.[idx]||'');
        sp.onclick = ()=>clear(idx);
        eqDiv.appendChild(sp);
        idx++;
      } else {
        eqDiv.insertAdjacentText('beforeend', p);
      }
    });
    // Build digits
    for (let d=1; d<=9; d++){
      const b=document.createElement('div');
      b.className='digit'; b.textContent=d;
      if (answers[current]?.includes(d)) b.classList.add('used');
      b.onclick = ()=>pick(d);
      padDiv.appendChild(b);
    }
    prevBtn.disabled = current===0;
    nextBtn.textContent = current===quiz.length-1?'Submit':'Next';
  }

  function pick(d){
    answers[current]=answers[current]||[];
    const bls = [...eqDiv.querySelectorAll('.blank')];
    for (let i=0;i<bls.length;i++){
      if (!answers[current][i]){
        answers[current][i]=d;
        break;
      }
    }
    render();
  }
  function clear(i){
    if (!answers[current]) return;
    answers[current][i]=null;
    render();
  }
  function clearLast(){
    const arr=answers[current]||[];
    const last=arr.map((v,i)=>v?i:-1).filter(i=>i>=0).pop();
    if (last!=null) arr[last]=null;
    render();
  }
  function changeQ(dir){
    // ensure filled before moving on
    const blanks = eqDiv.querySelectorAll('.blank');
    const a = answers[current] || [];
    if (dir>0 && (a.length<blanks.length || a.some(v=>!v))) {
      alert('Fill all blanks to proceed.');
      return;
    }
    current += dir;
    if (current < quiz.length) render();
    else finish();
  }

  // 5) Finish & Results
  function finish(){
    clearInterval(timerId);
    testContainer.style.display='none';
    resOvl.style.display='flex';
    let score=0;
    quiz.forEach((q,i)=>{
      const ua=answers[i]||[];
      const correct = q.answers.some(ans =>
        ans.length===ua.length && ans.every((n,j)=>n===ua[j])
      );
      if (correct) score++;
      const li = document.createElement('li');
      li.innerHTML=`
        <strong>Q${i+1}:</strong> ${q.expr.replace(/__/g,'__')}<br>
        Your: <span class="${correct?'correct':'wrong'}">${ua.join(', ')}</span><br>
        ${!correct?`Correct: ${q.answers[0].join(', ')}`:''}
      `;
      resList.appendChild(li);
    });
    scoreSp.textContent = score;
    pctSp.textContent = Math.round(score/quiz.length*100);
  }

  // Utility: shuffle
  function shuffle(a){
    const arr = a.slice();
    for (let i=arr.l

