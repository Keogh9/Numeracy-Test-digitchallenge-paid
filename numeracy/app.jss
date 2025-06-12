document.addEventListener('DOMContentLoaded', () => {
  // Element refs
  const instrOvl = document.getElementById('instructions-overlay');
  const testC    = document.getElementById('test-container');
  const resC     = document.getElementById('results-container');
  const startB   = document.getElementById('start-btn');
  const prevB    = document.getElementById('prev-btn');
  const nextB    = document.getElementById('next-btn');
  const clearB   = document.getElementById('clear-btn');
  const retakeB  = document.getElementById('retake-btn');
  const eqDiv    = document.getElementById('equation');
  const padDiv   = document.getElementById('digit-pad');
  const timerD   = document.getElementById('timer');
  const compD    = document.getElementById('completed');
  const scoreD   = document.getElementById('score');
  const totalD   = document.getElementById('total-questions');
  const pctD     = document.getElementById('percent');
  const list     = document.getElementById('results-list');

  // State
  let bank = [], idx = 0;
  const answers = {};
  const seen = new Set();
  let count = 0, timerId;

  // Disable start until bank is loaded
  startB.disabled = true;
  startB.textContent = 'Loading…';

  // 1) Load questions.json via absolute path
  fetch('/numeracy/questions.json')
    .then(r => r.json())
    .then(qs => {
      bank = shuffle(qs);
      totalD.textContent = bank.length;
    })
    .catch(() => {
      instrOvl.querySelector('p').textContent = 'Unable to load test. Please try again later.';
    })
    .finally(() => {
      startB.disabled = false;
      startB.textContent = 'Start Test';
      startB.onclick = beginTest;
    });

  // Handlers
  prevB.onclick   = () => { if (idx>0) { idx--; render(); } };
  nextB.onclick   = nextQ;
  clearB.onclick  = clearLast;
  retakeB.onclick = () => location.reload();

  function beginTest() {
    instrOvl.style.display = 'none';
    testC.classList.remove('hidden');
    render();
    startTimer(300);
  }

  // Timer
  function startTimer(s) {
    let rem = s;
    timerD.textContent = fmt(rem);
    timerId = setInterval(() => {
      rem--; timerD.textContent = fmt(rem);
      if (rem<=0) {
        clearInterval(timerId);
        showRes();
      }
    },1000);
  }
  function fmt(sec) {
    const m = String(Math.floor(sec/60)).padStart(2,'0');
    const s = String(sec%60).padStart(2,'0');
    return `${m}:${s}`;
  }

  // Render question
  function render() {
    const q = bank[idx];
    eqDiv.innerHTML = '';
    padDiv.innerHTML = '';
    let b=0;
    q.expr.split(/(__)/g).forEach(p => {
      if (p==='__') {
        const sp = document.createElement('span');
        sp.className='blank';
        sp.dataset.i=b;
        const ua = answers[idx]||[];
        sp.textContent=ua[b]||'';
        sp.onclick=()=>{ answers[idx][b]=null; render(); };
        eqDiv.appendChild(sp);
        b++;
      } else eqDiv.insertAdjacentText('beforeend',p);
    });
    for (let d=1; d<=9; d++){
      const btn=document.createElement('div');
      btn.className='digit'; btn.textContent=d;
      const ua = answers[idx]||[];
      if (ua.includes(d)) btn.classList.add('used');
      btn.onclick=()=>{ pick(d); };
      padDiv.appendChild(btn);
    }
    compD.textContent = count;
    prevB.disabled = (idx===0);
    nextB.textContent = (idx===bank.length-1?'Submit':'Next');
  }

  function pick(d) {
    if (!answers[idx]) answers[idx]=[];
    const blanks=eqDiv.querySelectorAll('.blank');
    for(let i=0;i<blanks.length;i++){
      if(!answers[idx][i]){
        answers[idx][i]=d;break;
      }
    }
    render();
  }
  function clearLast() {
    const arr=answers[idx]||[];
    const last=arr.map((v,i)=>v?i:-1).filter(i=>i>=0).pop();
    if(last>=0){arr[last]=null;render();}
  }
  function nextQ(){
    const blanks=eqDiv.querySelectorAll('.blank');
    const ua=answers[idx]||[];
    if(ua.length<blanks.length||ua.some(v=>!v)){
      return alert('Please fill all blanks');
    }
    if(!seen.has(idx)){ seen.add(idx); count++; }
    idx++;
    if(idx>=bank.length) showRes();
    else render();
  }

  // Show results
  function showRes() {
    clearInterval(timerId);
    testC.style.display='none';
    resC.style.display='flex';
    let score=0;
    Array.from(seen).sort((a,b)=>a-b).forEach(i=>{
      const q=bank[i], ua=answers[i]||[];
      const expr=build(q.expr,ua);
      const exp=+q.expr.split('=')[1];
      const act=eval(expr.replace(/×/g,'*').replace(/−/g,'-'));
      const ok=(act===exp);
      if(ok) score++;
      const li=document.createElement('li');
      li.innerHTML=`<strong>Q${i+1}:</strong>
        <span class="${ok?'correct':'wrong'}">${expr} = ${exp}</span>`;
      list.appendChild(li);
    });
    scoreD.textContent=score;
    pctD.textContent=Math.round(100*score/seen.size);
  }

  // Helpers
  function build(expr, ua){
    let i=0;
    return expr.split(/(__)/g)
      .map(p=>p==='__'?ua[i++]:p)
      .join('').split('=')[0].trim();
  }
  function shuffle(a){
    const arr=a.slice();
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }
});

