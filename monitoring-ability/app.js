document.addEventListener('DOMContentLoaded', () => {
  const instrOvl = document.getElementById('instructions-overlay');
  const testC    = document.getElementById('test-container');
  const resultsC = document.getElementById('results-container');
  const startBtn = document.getElementById('start-btn');
  const canvas   = document.getElementById('monitor-canvas');
  const pad      = document.getElementById('answer-pad');
  const timerEl  = document.getElementById('timer');
  const attEl    = document.getElementById('attempted');
  const scoreEl  = document.getElementById('score');
  const totalEl  = document.getElementById('total');
  const listEl   = document.getElementById('results-list');
  const retakeBtn= document.getElementById('retake-btn');
  const homeBtn  = document.getElementById('home-btn');

  const ctx = canvas.getContext('2d');
  let bank = [], idx=0, ready=false;
  const responses = [];
  let timerId, startTime;

  // Load question bank
  fetch('questions.json')
    .then(r=>r.json())
    .then(qs=>{
      bank = shuffle(qs);
      ready = true;
    })
    .catch(()=> alert('Failed to load test.'));

  startBtn.onclick = () => {
    if(!ready) return alert('Loading…');
    instrOvl.style.display = 'none';
    testC.classList.remove('hidden');
    startTime = Date.now();
    startTimer(120);
    nextTrial();
  };

  function startTimer(sec) {
    let rem = sec;
    timerEl.textContent = fmt(rem);
    timerId = setInterval(() => {
      rem = Math.ceil((120000 - (Date.now()-startTime))/1000);
      if(rem<0) rem=0;
      timerEl.textContent = fmt(rem);
      if(rem<=0) {
        clearInterval(timerId);
        endTest();
      }
    }, 100);
  }
  function fmt(s) {
    const m = String(Math.floor(s/60)).padStart(2,'0'),
          ss= String(s%60).padStart(2,'0');
    return `${m}:${ss}`;
  }

  function nextTrial() {
    const q = bank[idx % bank.length];
    runTrial(q.count);
    idx++;
  }

  function runTrial(count) {
    // prepare dots
    const dots = [];
    const R = canvas.width/2;
    for(let i=0;i<count;i++){
      const angle = Math.random()*2*Math.PI;
      const r = Math.random()*(R-10);
      const x = R + r*Math.cos(angle);
      const y = R + r*Math.sin(angle);
      const speed = 1.5 + Math.random(); // px per frame
      const dir = Math.random()*2*Math.PI;
      dots.push({x,y,dx:Math.cos(dir)*speed,dy:Math.sin(dir)*speed});
    }
    // clear pad
    pad.innerHTML = '';
    // build choices: correct + 4 distractors
    const choices = makeChoices(count,3,12,4);
    choices.forEach(n=>{
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.textContent = n;
      btn.onclick = ()=>record(count,n);
      pad.appendChild(btn);
    });
    // animation loop
    let anim;
    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      dots.forEach(d=>{
        // bounce
        if(d.x<=5||d.x>=canvas.width-5) d.dx*=-1;
        if(d.y<=5||d.y>=canvas.height-5) d.dy*=-1;
        d.x+=d.dx; d.y+=d.dy;
        ctx.beginPath();
        ctx.arc(d.x,d.y,5,0,2*Math.PI);
        ctx.fillStyle='white';
        ctx.fill();
      });
      anim = requestAnimationFrame(draw);
    }
    draw();

    // record and proceed
    function record(correct, picked){
      cancelAnimationFrame(anim);
      const ok = picked===correct;
      responses.push({correct, picked});
      attEl.textContent = responses.length;
      // if time remains
      if(Date.now() - startTime < 120000) {
        nextTrial();
      } else {
        endTest();
      }
    }
  }

  function endTest() {
    testC.style.display    = 'none';
    resultsC.style.display = 'flex';
    // show results
    const attempted = responses.length;
    const score = responses.filter(r=>r.picked===r.correct).length;
    scoreEl.textContent = score;
    totalEl.textContent = attempted;
    listEl.innerHTML = '';
    responses.forEach((r,i)=>{
      const li = document.createElement('li');
      li.innerHTML = `<strong>Trial ${i+1}:</strong>
        <span class="${r.picked===r.correct?'correct':'wrong'}">
          You: ${r.picked} &mdash; ${r.correct}
        </span>`;
      listEl.appendChild(li);
    });
  }

  retakeBtn.onclick = () => location.reload();
  homeBtn.onclick   = () => window.location.href = '/';

  // Helpers
  function shuffle(a){
    const arr=[...a];
    for(let i=arr.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [arr[i],arr[j]]=[arr[j],arr[i]];
    }
    return arr;
  }
  function makeChoices(correct,min,max,nDistr) {
    const set = new Set([correct]);
    while(set.size < nDistr+1) {
      set.add(Math.floor(Math.random()*(max-min+1))+min);
    }
    const arr = Array.from(set);
    return shuffle(arr);
  }
});
