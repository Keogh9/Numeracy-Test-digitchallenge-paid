document.addEventListener('DOMContentLoaded', () => {
  const instrOvl   = document.getElementById('instructions-overlay');
  const testC      = document.getElementById('test-container');
  const resultsC   = document.getElementById('results-container');
  const startBtn   = document.getElementById('start-btn');
  const prevBtn    = document.getElementById('prev-btn');
  const nextBtn    = document.getElementById('next-btn');
  const clearBtn   = document.getElementById('clear-btn');
  const retakeBtn  = document.getElementById('retake-btn');
  const homeBtn    = document.getElementById('home-btn');
  const eqDiv      = document.getElementById('equation');
  const padDiv     = document.getElementById('digit-pad');
  const timerEl    = document.getElementById('timer');
  const compEl     = document.getElementById('completed');
  const scoreEl    = document.getElementById('score');
  const totalEl    = document.getElementById('total-questions');
  const pctEl      = document.getElementById('percent');
  const listEl     = document.getElementById('results-list');

  let bank = [], idx = 0, ready = false;
  const userAnswers = {};
  const answeredSet = new Set();
  let timerId;

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

  startBtn.onclick = () => {
    if (!ready) return alert('Please wait, loading questions…');
    instrOvl.style.display = 'none';
    testC.classList.remove('hidden');
    renderQuestion();
    startTimer(300);
  };

  prevBtn.onclick   = () => { if (idx>0) idx--, renderQuestion(); };
  nextBtn.onclick   = nextQuestion;
  clearBtn.onclick  = clearLast;
  retakeBtn.onclick = () => location.reload();
  homeBtn.onclick   = () => window.location.href = '/';

  function startTimer(sec) {
    let rem = sec;
    timerEl.textContent = fmt(rem);
    timerId = setInterval(() => {
      rem--; timerEl.textContent = fmt(rem);
      if (rem <= 0) {
        clearInterval(timerId);
        showResults();
      }
    }, 1000);
  }
  function fmt(s) {
    const m = String(Math.floor(s/60)).padStart(2,'0'),
          ss= String(s%60).padStart(2,'0');
    return `${m}:${ss}`;
  }

  function renderQuestion() {
    const q = bank[idx];
    eqDiv.innerHTML = '';
    padDiv.innerHTML = '';
    const ua = userAnswers[idx] || [];
    let b = 0;
    q.expr.split(/(__)/g).forEach(part => {
      if (part === '__') {
        const sp = document.createElement('span');
        sp.className = 'blank';
        sp.dataset.b = b;
        sp.textContent = ua[b] || '';
        sp.onclick = () => { ua[b] = null; renderQuestion(); };
        eqDiv.appendChild(sp);
        b++;
      } else {
        eqDiv.insertAdjacentText('beforeend', part);
      }
    });
    for (let d = 1; d <= 9; d++) {
      const btn = document.createElement('div');
      btn.className = 'digit';
      btn.textContent = d;
      if (ua.includes(d)) btn.classList.add('used');
      btn.onclick = () => {
        if (!userAnswers[idx]) userAnswers[idx] = [];
        for (let i = 0; i < b; i++) {
          if (!userAnswers[idx][i]) { userAnswers[idx][i] = d; break; }
        }
        renderQuestion();
      };
      padDiv.appendChild(btn);
    }
    compEl.textContent = answeredSet.size;
    prevBtn.disabled   = idx===0;
    nextBtn.textContent = idx === bank.length - 1 ? 'Submit' : 'Next';
  }

  function clearLast() {
    const ua = userAnswers[idx] || [];
    const last = ua.map((v,i) => v ? i : -1).filter(i=>i>=0).pop();
    if (last >= 0) { ua[last] = null; renderQuestion(); }
  }

  function nextQuestion() {
    const blanks = eqDiv.querySelectorAll('.blank');
    const ua = userAnswers[idx] || [];
    if (ua.length < blanks.length || ua.some(v=>!v)) {
      return alert('Please fill all blanks.');
    }
    if (!answeredSet.has(idx)) answeredSet.add(idx);
    if (idx === bank.length - 1) showResults();
    else { idx++; renderQuestion(); }
  }

  function showResults() {
    clearInterval(timerId);
    testC.style.display    = 'none';
    resultsC.style.display = 'flex';
    listEl.innerHTML       = '';
    let score = 0;

    Array.from(answeredSet).sort((a,b)=>a-b).forEach(i => {
      const q = bank[i];
      const ua = userAnswers[i] || [];
      const expr = buildExpr(q.expr, ua);
      const expected = parseInt(q.expr.split('=')[1].trim(),10);
      const actual   = evaluateExpression(expr);
      const correct  = actual === expected;
      if (correct) score++;

      const li = document.createElement('li');
      li.innerHTML = `<strong>Q${i+1}:</strong>
        <span class="${correct?'correct':'wrong'}">${expr} = ${expected}</span>`;
      if (!correct) {
        const alts = findAlternatives(q.expr, expected, ua, 3);
        if (alts.length) {
          const div = document.createElement('div');
          div.className = 'suggestion';
          div.textContent = 'Possible solutions: ' +
            alts.map(arr => {
              let j=0;
              const filled = q.expr.split(/(__)/g)
                .map(p => p==='__' ? arr[j++] : p)
                .join('').split('=')[0].trim();
              return `${filled} = ${expected}`;
            }).join('; ');
          li.appendChild(div);
        }
      }
      listEl.appendChild(li);
    });

    scoreEl.textContent  = score;
    pctEl.textContent    = Math.round(100*score/answeredSet.size);
  }

  // Helpers ------------------------------------------------

  function buildExpr(tmpl, ua) {
    let i = 0;
    return tmpl.split(/(__)/g)
      .map(p => p==='__' ? ua[i++] : p)
      .join('').split('=')[0].trim();
  }

  function evaluateExpression(str) {
    const js = str.replace(/×/g,'*').replace(/−/g,'-');
    try { return eval(js); } catch { return NaN; }
  }

  function findAlternatives(tmpl, target, userAns, max) {
    const count = (tmpl.match(/__/g) || []).length;
    const results = [];
    const used = new Set();
    function backtrack(pos, arr) {
      if (results.length >= max) return;
      if (pos === count) {
        if (arr.every((n,i)=>n===userAns[i])) return;
        const expr = buildExpr(tmpl, arr);
        if (evaluateExpression(expr) === target) {
          results.push(arr.slice());
        }
        return;
      }
      for (let d = 1; d <= 9; d++) {
        if (used.has(d)) continue;
        used.add(d);
        arr[pos] = d;
        backtrack(pos+1, arr);
        used.delete(d);
        if (results.length >= max) break;
      }
    }
    backtrack(0, []);
    return results;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }
});

