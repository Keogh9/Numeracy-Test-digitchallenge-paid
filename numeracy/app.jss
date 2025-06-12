document.addEventListener('DOMContentLoaded', () => {
  const instrOvl   = document.getElementById('instructions-overlay');
  const testC      = document.getElementById('test-container');
  const resultsC   = document.getElementById('results-container');
  const startBtn   = document.getElementById('start-btn');
  const prevBtn    = document.getElementById('prev-btn');
  const nextBtn    = document.getElementById('next-btn');
  const clearBtn   = document.getElementById('clear-btn');
  const retakeBtn  = document.getElementById('retake-btn');
  const equationEl = document.getElementById('equation');
  const padEl      = document.getElementById('digit-pad');
  const timerEl    = document.getElementById('timer');
  const completedEl= document.getElementById('completed');
  const scoreEl    = document.getElementById('score');
  const totalEl    = document.getElementById('total-questions');
  const percentEl  = document.getElementById('percent');
  const resultsList= document.getElementById('results-list');

  let questions = [], idx = 0, loaded = false;
  const answers = {};
  const seen    = [];
  let timerId;

  // Disable Start until loaded
  startBtn.disabled = true;
  startBtn.textContent = 'Loading…';

  fetch('questions.json')
    .then(r => r.json())
    .then(qs => {
      questions = shuffle(qs);
      totalEl.textContent = questions.length;
      loaded = true;
    })
    .catch(err => {
      console.error(err);
      instrOvl.querySelector('p').textContent = 'Failed to load test.';
    })
    .finally(() => {
      startBtn.disabled = false;
      startBtn.textContent = 'Start Test';
    });

  startBtn.addEventListener('click', () => {
    if (!loaded) return alert('Loading questions…');
    instrOvl.style.display = 'none';
    testC.classList.remove('hidden');
    renderQuestion();
    startTimer(300);
  });

  prevBtn.addEventListener('click', () => {
    if (idx > 0) { idx--; renderQuestion(); }
  });
  nextBtn.addEventListener('click', handleNext);
  clearBtn.addEventListener('click', clearLast);
  retakeBtn.addEventListener('click', () => location.reload());

  function startTimer(sec) {
    let rem = sec;
    timerEl.textContent = fmt(rem);
    timerId = setInterval(() => {
      rem--;
      timerEl.textContent = fmt(rem);
      if (rem <= 0) { clearInterval(timerId); showResults(); }
    }, 1000);
  }
  function fmt(s) {
    const m = String(Math.floor(s/60)).padStart(2,'0'),
          ss= String(s%60).padStart(2,'0');
    return `${m}:${ss}`;
  }

  function renderQuestion() {
    const q = questions[idx];
    equationEl.innerHTML = '';
    padEl.innerHTML = '';
    const ua = answers[idx] || [];
    let b=0;
    q.expr.split(/(__)/g).forEach(part => {
      if (part==='__') {
        const span = document.createElement('span');
        span.className='blank';
        span.dataset.b=b;
        span.textContent=ua[b]||'';
        span.onclick=()=>{ ua[b]=null; renderQuestion(); };
        equationEl.appendChild(span);
        b++;
      } else {
        equationEl.insertAdjacentText('beforeend',part);
      }
    });
    for (let d=1; d<=9; d++){
      const btn = document.createElement('div');
      btn.className='digit';
      btn.textContent=d;
      if (ua.includes(d)) btn.classList.add('used');
      btn.onclick=()=>{
        if (!answers[idx]) answers[idx]=[];
        for (let i=0;i<b;i++){
          if (!answers[idx][i]){ answers[idx][i]=d; break; }
        }
        renderQuestion();
      };
      padEl.appendChild(btn);
    }
    completedEl.textContent = seen.length;
    prevBtn.disabled = idx===0;
    nextBtn.textContent = idx===questions.length-1 ? 'Submit' : 'Next';
  }

  function clearLast() {
    const ua = answers[idx]||[];
    const last = ua.map((v,i)=>v?i:-1).filter(i=>i>=0).pop();
    if (last>=0){ ua[last]=null; renderQuestion(); }
  }

  function handleNext() {
    const blanks = equationEl.querySelectorAll('.blank');
    const ua = answers[idx]||[];
    if (ua.length < blanks.length || ua.some(v=>!v)) {
      return alert('Please fill all blanks.');
    }
    if (!seen.includes(idx)) seen.push(idx);
    if (idx===questions.length-1) showResults();
    else { idx++; renderQuestion(); }
  }

  function showResults() {
    clearInterval(timerId);
    testC.style.display = 'none';
    resultsC.style.display = 'flex';
    resultsList.innerHTML='';
    let score=0;
    seen.forEach(i=>{
      const q = questions[i];
      const ua=answers[i]||[];
      const expr = build(q.expr,ua);
      const expected = +q.expr.split('=')[1].trim();
      const actual = eval(expr.replace(/×/g,'*').replace(/−/g,'-'));
      const ok = actual===expected;
      if (ok) score++;
      const li = document.createElement('li');
      li.innerHTML=`<strong>Q${i+1}:</strong> <span class="${ok?'correct':'wrong'}">${expr} = ${expected}</span>`;
      resultsList.appendChild(li);
    });
    scoreEl.textContent = score;
    percentEl.textContent = Math.round(100*score/seen.length);
  }

  function build(template, ua) {
    let i=0;
    return template.split(/(__)/g)
      .map(p=>p==='__'?ua[i++]:p)
      .join('').split('=')[0].trim();
  }

  function shuffle(a) {
    const arr=[...a];
    for (let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }
});

