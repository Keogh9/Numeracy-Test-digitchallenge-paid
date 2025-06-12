document.addEventListener('DOMContentLoaded', () => {
  const instrOvl  = document.getElementById('instructions-overlay');
  const testC     = document.getElementById('test-container');
  const resC      = document.getElementById('results-container');
  const startBtn  = document.getElementById('start-btn');
  const prevBtn   = document.getElementById('prev-btn');
  const nextBtn   = document.getElementById('next-btn');
  const clearBtn  = document.getElementById('clear-btn');
  const retakeBtn = document.getElementById('retake-btn');
  const eqDiv     = document.getElementById('equation');
  const padDiv    = document.getElementById('digit-pad');
  const timerEl   = document.getElementById('timer');
  const compEl    = document.getElementById('completed');
  const scoreEl   = document.getElementById('score');
  const totalEl   = document.getElementById('total-questions');
  const pctEl     = document.getElementById('percent');
  const listEl    = document.getElementById('results-list');

  let bank = [], idx = 0, ready = false;
  const answers = {};
  const seen = [];
  let timerId;

  // Disable Start until questions load
  startBtn.disabled = true;
  startBtn.textContent = 'Loading…';

  fetch('questions.json')
    .then(r => r.json())
    .then(qs => {
      bank = shuffle(qs);
      totalEl.textContent = bank.length;
      ready = true;
    })
    .catch(() => {
      instrOvl.querySelector('p').textContent = 'Error loading test.';
    })
    .finally(() => {
      startBtn.disabled = false;
      startBtn.textContent = 'Start Test';
    });

  startBtn.addEventListener('click', () => {
    if (!ready) return alert('Please wait…');
    instrOvl.style.display = 'none';
    testC.classList.remove('hidden');
    render();
    startTimer(300);
  });

  prevBtn.addEventListener('click', () => {
    if (idx>0) { idx--; render(); }
  });
  nextBtn.addEventListener('click', handleNext);
  clearBtn.addEventListener('click', clearLast);
  retakeBtn.addEventListener('click', () => location.reload());

  function startTimer(sec) {
    let rem = sec;
    timerEl.textContent = fmt(rem);
    timerId = setInterval(() => {
      rem--; timerEl.textContent = fmt(rem);
      if (rem<=0) { clearInterval(timerId); showResults(); }
    }, 1000);
  }
  function fmt(s) {
    const m=String(Math.floor(s/60)).padStart(2,'0'),
          ss=String(s%60).padStart(2,'0');
    return `${m}:${ss}`;
  }

  function render() {
    const q = bank[idx];
    eqDiv.innerHTML = '';
    padDiv.innerHTML = '';
    const ua = answers[idx] || [];
    let b=0;
    q.expr.split(/(__)/g).forEach(part => {
      if (part==='__') {
        const sp = document.createElement('span');
        sp.className='blank';
        sp.dataset.b=b;
        sp.textContent=ua[b]||'';
        sp.onclick=()=>{ ua[b]=null; render(); };
        eqDiv.appendChild(sp);
        b++;
      } else {
        eqDiv.insertAdjacentText('beforeend',part);
      }
    });
    for (let d=1; d<=9; d++){
      const btn=document.createElement('div');
      btn.className='digit'; btn.textContent=d;
      if (ua.includes(d)) btn.classList.add('used');
      btn.onclick=()=>{
        if (!answers[idx]) answers[idx]=[];
        for (let i=0;i<b;i++){
          if (!answers[idx][i]){ answers[idx][i]=d; break; }
        }
        render();
      };
      padDiv.appendChild(btn);
    }
    compEl.textContent = seen.length;
    prevBtn.disabled = (idx===0);
    nextBtn.textContent = (idx===bank.length-1 ? 'Submit' : 'Next');
  }

  function clearLast() {
    const ua = answers[idx]||[];
    const last = ua.map((v,i)=>v?i:-1).filter(i=>i>=0).pop();
    if (last>=0){ ua[last]=null; render(); }
  }

  function handleNext() {
    const blanks = eqDiv.querySelectorAll('.blank');
    const ua = answers[idx]||[];
    if (ua.length<blanks.length||ua.some(v=>!v)) {
      return alert('Fill all blanks first.');
    }
    if (!seen.includes(idx)) seen.push(idx);
    if (idx===bank.length-1) showResults();
    else { idx++; render(); }
  }

  function showResults() {
    clearInterval(timerId);
    testC.style.display='none';
    resultsC.style.display='flex';
    listEl.innerHTML='';
    let score=0;
    seen.forEach(i=>{
      const q=bank[i], ua=answers[i]||[];
      const expr = build(q.expr,ua);
      const exp   =+q.expr.split('=')[1].trim();
      const act   = eval(expr.replace(/×/g,'*').replace(/−/g,'-'));
      const ok    = act===exp;
      if(ok) score++;
      const li = document.createElement('li');
      li.innerHTML=`<strong>Q${i+1}:</strong>
        <span class="${ok?'correct':'wrong'}">${expr} = ${exp}</span>`;
      listEl.appendChild(li);
    });
    scoreEl.textContent = score;
    pctEl.textContent   = Math.round(100*score/seen.length);
  }

  function build(template, ua) {
    let i=0;
    return template.split(/(__)/g)
      .map(p=>p==='__'?ua[i++]:p)
      .join('').split('=')[0].trim();
  }

  function shuffle(arr) {
    const a=[...arr];
    for (let i=a.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }
});

