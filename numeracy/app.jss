document.addEventListener('DOMContentLoaded', () => {
  // Element references
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
  let bank = [], idx = 0, loaded = false;
  const answers = {};
  const seen = new Set();
  let count = 0, timerId = null;

  // Disable start until questions are loaded
  startB.disabled = true;
  startB.textContent = 'Loading…';

  // Load and shuffle
  fetch('questions.json')
    .then(r => r.json())
    .then(qs => {
      bank = shuffle(qs);
      totalD.textContent = bank.length;
      loaded = true;
    })
    .catch(err => {
      console.error(err);
      instrOvl.querySelector('p').textContent = 'Failed to load test. Please refresh.';
    })
    .finally(() => {
      startB.disabled = false;
      startB.textContent = 'Start Test';
    });

  // Always wire up the click, but guard on loaded
  startB.addEventListener('click', () => {
    if (!loaded) return alert('Please wait, loading questions…');
    instrOvl.style.display = 'none';
    testC.classList.remove('hidden');
    render();
    startTimer(300);
  });

  // Navigation & controls
  prevB.addEventListener('click', () => {
    if (idx > 0) { idx--; render(); }
  });
  nextB.addEventListener('click', nextQ);
  clearB.addEventListener('click', clearLast);
  retakeB.addEventListener('click', () => location.reload());

  // Timer
  function startTimer(sec) {
    let rem = sec;
    timerD.textContent = fmt(rem);
    timerId = setInterval(() => {
      rem--;
      timerD.textContent = fmt(rem);
      if (rem <= 0) {
        clearInterval(timerId);
        showRes();
      }
    }, 1000);
  }
  function fmt(s) {
    const m = String(Math.floor(s/60)).padStart(2,'0');
    const ss = String(s%60).padStart(2,'0');
    return `${m}:${ss}`;
  }

  // Render a question
  function render() {
    const q = bank[idx];
    eqDiv.innerHTML = '';
    padDiv.innerHTML = '';
    let b=0;
    q.expr.split(/(__)/g).forEach(p => {
      if (p==='__') {
        const sp = document.createElement('span');
        sp.className = 'blank';
        sp.dataset.i = b;
        const ua = answers[idx]||[];
        sp.textContent = ua[b]||'';
        sp.onclick = () => { 
          ua[b]=null; 
          render(); 
        };
        eqDiv.appendChild(sp);
        b++;
      } else {
        eqDiv.insertAdjacentText('beforeend', p);
      }
    });

    for (let d=1; d<=9; d++){
      const btn = document.createElement('div');
      btn.className = 'digit';
      btn.textContent = d;
      const ua = answers[idx]||[];
      if (ua.includes(d)) btn.classList.add('used');
      btn.onclick = () => {
        if (!answers[idx]) answers[idx]=[];
        for (let i=0; i<b; i++){
          if (!answers[idx][i]) { answers[idx][i]=d; break; }
        }
        render();
      };
      padDiv.appendChild(btn);
    }

    compD.textContent = count;
    prevB.disabled    = idx===0;
    nextB.textContent = idx===bank.length-1 ? 'Submit' : 'Next';
  }

  function clearLast() {
    const ua = answers[idx]||[];
    const last = ua.map((v,i)=>v?i:-1).filter(i=>i>=0).pop();
    if (last>=0) {
      ua[last]=null;
      render();
    }
  }

  function nextQ() {
    const blanks = eqDiv.querySelectorAll('.blank');
    const ua = answers[idx]||[];
    if (ua.length < blanks.length || ua.some(v=>!v)) {
      return alert('Please fill every blank.');
    }
    if (!seen.has(idx)) { seen.add(idx); count++; }
    idx++;
    if (idx >= bank.length) showRes();
    else render();
  }

  // Show results
  function showRes() {
    clearInterval(timerId);
    testC.style.display    = 'none';
    resC.style.display     = 'flex';
    list.innerHTML         = '';

    const answered = Array.from(seen).sort((a,b)=>a-b);
    let score = 0;
    answered.forEach(i => {
      const q = bank[i];
      const ua = answers[i]||[];
      const userExpr = build(q.expr, ua);
      const expected = +q.expr.split('=')[1].trim();
      const actual = eval(userExpr.replace(/×/g,'*').replace(/−/g,'-'));
      const ok = actual===expected;
      if (ok) score++;

      const li = document.createElement('li');
      li.innerHTML = `
        <strong>Q${i+1}:</strong>
        <span class="${ok?'correct':'wrong'}">${userExpr} = ${expected}</span>
      `;
      list.appendChild(li);
    });

    scoreD.textContent = score;
    pctD.textContent   = Math.round(100 * score / answered.length);
  }

  // Helpers
  function build(expr, ua) {
    let i=0;
    return expr
      .split(/(__)/g)
      .map(p => p==='__' ? ua[i++] : p)
      .join('')
      .split('=')[0]
      .trim();
  }
  function shuffle(a) {
    const arr = [...a];
    for (let i = arr.length-1; i>0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]] = [arr[j],arr[i]];
    }
    return arr;
  }
});

