
const QUESTIONS=[
 {cat:"أولًا: المفاهيم الأساسية",text:"ما المقصود بالكسور المتكافئة؟",options:["كسور لها القيمة نفسها.","كسور لها المقام نفسه.","كسور لها البسط نفسه."]},
 {cat:"أولًا: المفاهيم الأساسية",text:"هل الكسور المتكافئة لها القيمة نفسها؟",options:["لا.","نعم.","أحيانًا."]},
 {cat:"أولًا: المفاهيم الأساسية",text:"كيف نحصل على كسر مكافئ باستعمال الضرب؟",options:["نضرب البسط فقط.","نضرب المقام فقط.","نضرب البسط والمقام في العدد نفسه غير الصفر."]},
 {cat:"أولًا: المفاهيم الأساسية",text:"كيف نحصل على كسر مكافئ باستعمال القسمة؟",options:["نقسم البسط والمقام على العدد نفسه غير الصفر.","نقسم البسط فقط.","نقسم المقام فقط."]},
 {cat:"أولًا: المفاهيم الأساسية",html:"هل الكسران <span class='math-inline'><span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'>٢</span></span> و <span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'>٤</span></span></span> متكافئان؟",options:["نعم.","لا.","لا يمكن تحديد ذلك."]},

 {cat:"ثانيًا: أكملي الكسر المكافئ",html:"ما العدد المناسب في الفراغ؟<br><br><span class='math-inline'><span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'>٢</span></span> = <span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'><span class='blank-box'>؟</span></span></span></span>",options:["٣","٤","٦"]},
 {cat:"ثانيًا: أكملي الكسر المكافئ",html:"ما العدد المناسب في الفراغ؟<br><br><span class='math-inline'><span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'>٣</span></span> = <span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'><span class='blank-box'>؟</span></span></span></span>",options:["٦","٤","٩"]},
 {cat:"ثانيًا: أكملي الكسر المكافئ",html:"ما العدد المناسب في الفراغ؟<br><br><span class='math-inline'><span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'>٥</span></span> = <span class='frac'><span class='num'>٤</span><span class='line'></span><span class='den'><span class='blank-box'>؟</span></span></span></span>",options:["٧","٨","١٠"]},
 {cat:"ثانيًا: أكملي الكسر المكافئ",html:"ما العدد المناسب في الفراغ؟<br><br><span class='math-inline'><span class='frac'><span class='num'>٣</span><span class='line'></span><span class='den'>٤</span></span> = <span class='frac'><span class='num'>٦</span><span class='line'></span><span class='den'><span class='blank-box'>؟</span></span></span></span>",options:["٦","٨","١٢"]},
 {cat:"ثانيًا: أكملي الكسر المكافئ",html:"ما العدد المناسب في الفراغ؟<br><br><span class='math-inline'><span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'>٦</span></span> = <span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'><span class='blank-box'>؟</span></span></span></span>",options:["٢","٣","٤"]},

 {cat:"ثالثًا: صح أم خطأ",text:"الكسور المتكافئة لها القيمة نفسها.",options:["صح.","خطأ."]},
 {cat:"ثالثًا: صح أم خطأ",html:"الكسران <span class='math-inline'><span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'>٢</span></span> و <span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'>٤</span></span></span> متكافئان.",options:["صح.","خطأ."]},
 {cat:"ثالثًا: صح أم خطأ",text:"يمكن إيجاد كسر مكافئ بضرب البسط فقط.",options:["صح.","خطأ."]},
 {cat:"ثالثًا: صح أم خطأ",html:"الكسران <span class='math-inline'><span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'>٣</span></span> و <span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'>٦</span></span></span> متكافئان.",options:["صح.","خطأ."]}
];

const app=document.getElementById("app"), toastEl=document.getElementById("toast");
let ws=null,state=null,timer=null,soundEnabled=localStorage.getItem("hallaha_sound")!=="off";
const audios={
 lobby:new Audio("/audio/lobby.mp3"),
 start:new Audio("/audio/start.mp3"),
 winner:new Audio("/audio/winner.mp3")
};
audios.lobby.loop=true;audios.lobby.volume=.18;audios.start.volume=.55;audios.winner.volume=.58;
let winnerPlayed=false;

function toast(m){toastEl.textContent=m;toastEl.classList.add("show");setTimeout(()=>toastEl.classList.remove("show"),2200)}
function isHost(){return location.hash.startsWith("#/host")}
function playAudio(name){
 if(!isHost()||!soundEnabled)return;
 const a=audios[name]; if(!a)return;
 if(name!=="lobby")a.currentTime=0;
 a.play().catch(()=>{});
}
function stopAudio(name){const a=audios[name];if(a){a.pause();if(name!=="lobby")a.currentTime=0}}
document.getElementById("soundBtn").onclick=()=>{
 soundEnabled=!soundEnabled;localStorage.setItem("hallaha_sound",soundEnabled?"on":"off");
 document.getElementById("soundBtn").innerHTML=(soundEnabled?"🔊":"🔇")+" <span>الصوت</span>";
 if(!soundEnabled)Object.values(audios).forEach(a=>a.pause());
 toast(soundEnabled?"تم تشغيل الصوت":"تم إيقاف الصوت");
};

function sock(){
 if(ws&&ws.readyState<2)return ws;
 ws=new WebSocket((location.protocol==="https:"?"wss://":"ws://")+location.host);
 ws.onmessage=e=>handle(JSON.parse(e.data));
 ws.onclose=()=>setTimeout(()=>{ws=null;sock()},900);
 return ws;
}
function send(type,data={}){
 const p=JSON.stringify({type,...data}),s=sock();
 if(s.readyState===1)s.send(p);else s.addEventListener("open",()=>s.send(p),{once:true});
}
function handle(m){
 if(m.type==="error")return toast(m.message);
 if(m.type==="created"){sessionStorage.host=JSON.stringify({id:m.id,hostToken:m.hostToken});location.hash="#/host/session/"+m.id}
 if(m.type==="code_result"){if(!m.ok)return toast("رمز الجلسة غير صحيح");teamNamePage(m.id)}
 if(m.type==="joined"){localStorage.team=JSON.stringify({id:m.id,teamId:m.teamId,token:m.token});location.hash="#/play/"+m.id}
 if(m.type==="state"){state=m;renderState()}
}
function route(){
 clearInterval(timer);state=null;
 const h=location.hash||"#/";
 if(h==="#/")home();
 else if(h==="#/host")hostHome();
 else if(h==="#/join")joinPage();
 else if(h.startsWith("#/host/session/")){
  const x=JSON.parse(sessionStorage.host||"null");if(!x)return location.hash="#/host";
  send("host_reconnect",x);
 }else if(h.startsWith("#/play/")){
  const x=JSON.parse(localStorage.team||"null");if(!x)return location.hash="#/join";
  send("team_reconnect",x);
 }
}
addEventListener("hashchange",route);

function home(){
 stopAudio("lobby");
 app.innerHTML=`<section class="game-home">
  <div class="math-scene" aria-hidden="true">
   <span class="m1">½</span><span class="m2">¾</span><span class="m3">×</span><span class="m4">÷</span>
   <span class="m5">⅓</span><span class="m6">⅔</span><span class="m7">١/٢ = ٢/٤</span><span class="m8">=</span>
  </div>
  <div class="home-content">
   <div class="lesson-chip">اسم الدرس: تبسيط الكسور الاعتيادية</div>
   <div class="logo-word">حلّها</div>
   <div class="home-subtitle">تحدي تبسيط الكسور</div>
   <div class="home-cards">
    <a class="home-card" href="#/host"><span class="home-icon gear">⚙</span><strong>إعدادات المعلم</strong><small>إنشاء الجلسة والتحكم في التحدي</small></a>
    <a class="home-card" href="#/host"><span class="home-icon gold">▶</span><strong>ابدأ كمعلم</strong><small>ابدأ الجلسة واعرض الأسئلة للطالبات</small></a>
    <a class="home-card" href="#/join"><span class="home-icon cyan">▶</span><strong>ابدأ كمجموعة</strong><small>انضمي باستخدام رمز الجلسة</small></a>
   </div>
   <div class="home-meta">١٤ سؤالًا • ٥ مجموعات • ٢٠ ثانية لكل سؤال</div>
  </div>
 </section>`;
}
function hostHome(){
 stopAudio("lobby");
 app.innerHTML=`<section class="panel form-wrap center"><h2>لوحة المعلمة</h2><p class="muted">أنشئي جلسة جديدة لتحدي تبسيط الكسور.</p><button id="create" class="btn primary">إنشاء جلسة جديدة</button></section>`;
 document.getElementById("create").onclick=()=>send("create");
}
function joinPage(){
 app.innerHTML=`<section class="panel form-wrap"><h2>انضمي إلى التحدي</h2><p class="muted">أدخلي رمز الجلسة المكوّن من ٦ أرقام.</p><input id="joinCode" class="input" maxlength="6" inputmode="numeric" placeholder="رمز الجلسة"><div class="actions"><button id="enter" class="btn primary">دخول</button></div></section>`;
 document.getElementById("enter").onclick=()=>send("check_code",{code:document.getElementById("joinCode").value.trim()});
}
function teamNamePage(id){
 app.innerHTML=`<section class="panel form-wrap"><h2>اسم المجموعة</h2><input id="teamName" class="input" maxlength="30" placeholder="مثال: العبقريات"><div class="actions"><button id="joinTeam" class="btn primary">انضمام</button></div></section>`;
 document.getElementById("joinTeam").onclick=()=>{
  const name=document.getElementById("teamName").value.trim();if(!name)return toast("اكتبي اسم المجموعة");
  send("join",{id,name});
 };
}
function renderState(){
 const s=state.state,host=isHost();
 if(s.status==="waiting")return host?hostLobby(s):teamWait(state.team);
 if(s.status==="question_active")return host?hostQuestion(s):teamQuestion(s,state.answer);
 if(s.status==="question_reveal")return reveal(s,host,state.result);
 if(s.status==="leaderboard")return board(s,host);
 if(s.status==="finished")return final(s,host);
}
function hostLobby(s){
 playAudio("lobby");
 app.innerHTML=`<section class="panel center">
  <div class="muted">كود الجلسة</div><div class="session-code">${s.code}</div>
  <h3>${s.teams.length} / ٥ مجموعات متصلة</h3>
  <div class="team-grid">${s.teams.map(t=>`<div class="team-card"><div class="team-left"><span class="symbol">${t.symbol}</span>${t.name}</div><span class="tiny">متصلة</span></div>`).join("")||'<p class="muted">بانتظار انضمام المجموعات...</p>'}</div>
  <div class="actions"><button id="start" class="btn primary" ${s.teams.length<2?"disabled":""}>ابدئي التحدي</button></div>
 </section>`;
 document.getElementById("start").onclick=()=>{stopAudio("lobby");playAudio("start");act("start")};
}
function teamWait(t){app.innerHTML=`<section class="panel form-wrap center"><div class="symbol" style="margin:auto">${t.symbol}</div><h2>تم الانضمام</h2><p><strong>${t.name}</strong></p><p class="muted">بانتظار المعلمة لبدء التحدي</p></section>`}
function countdown(start,tid,bid){
 clearInterval(timer);const tick=()=>{const r=Math.max(0,20000-(Date.now()-start));const te=document.getElementById(tid),be=document.getElementById(bid);if(te)te.textContent=Math.ceil(r/1000);if(be)be.style.width=(r/20000*100)+"%"};tick();timer=setInterval(tick,200)
}
function hostQuestion(s){
 stopAudio("lobby");const q=QUESTIONS[s.q],answered=new Set(state.answered||[]);
 app.innerHTML=`<section class="panel question-shell">
  <div class="question-top"><span>السؤال ${s.q+1} من ${QUESTIONS.length}</span><span id="time">٢٠</span></div>
  <div class="bar"><div id="progress"></div></div>
  <div class="category-pill">${q.cat}</div>
  <div class="question-text">${q.html||q.text}</div>
  <div class="team-grid">${s.teams.map(t=>`<div class="team-card"><div class="team-left"><span class="symbol">${t.symbol}</span>${t.name}</div><strong>${answered.has(t.id)?"✓ أجابت":"بانتظار الإجابة"}</strong></div>`).join("")}</div>
 </section>`;
 countdown(s.started,"time","progress");
}
function teamQuestion(s,ans){
 const q=QUESTIONS[s.q];
 app.innerHTML=`<section class="panel question-shell">
  <div class="question-top"><span>السؤال ${s.q+1} من ${QUESTIONS.length}</span><span id="time">٢٠</span></div>
  <div class="bar"><div id="progress"></div></div>
  <p class="center muted">ناقشن الإجابة أولًا، ثم اخترن</p>
  <div class="category-pill">${q.cat}</div>
  <div class="question-text">${q.html||q.text}</div>
  <div class="answers">${q.options.map((o,i)=>`<button class="answer ${ans?.choice===i?"selected":""}" data-i="${i}" ${ans?"disabled":""}>${o}</button>`).join("")}</div>
  ${ans?'<div class="locked-note">تم اعتماد الإجابة • بانتظار بقية المجموعات</div>':""}
 </section>`;
 countdown(s.started,"time","progress");
 if(!ans)document.querySelectorAll(".answer").forEach(b=>b.onclick=()=>{
  const saved=JSON.parse(localStorage.team);document.querySelectorAll(".answer").forEach(x=>x.disabled=true);b.classList.add("selected");
  send("answer",{...saved,choice:Number(b.dataset.i)});
 });
}
function reveal(s,host,res){
 const q=QUESTIONS[s.q];
 const correctText=q.options[state.correctIndex??0]||"";
 app.innerHTML=`<section class="panel center">
  <h2>كشف الحل</h2>
  <div class="category-pill">${q.cat}</div>
  <div class="question-text">${q.html||q.text}</div>
  <div class="reveal-steps">
    <div class="step"><strong>الإجابة الصحيحة</strong><br>${state.correctLabel||correctText}</div>
    <div class="step">الكسور المتكافئة تمثل القيمة نفسها، ويمكن إيجادها بضرب أو قسمة البسط والمقام في العدد نفسه غير الصفر.</div>
  </div>
  ${host?'<div class="actions"><button id="lb" class="btn primary">عرض الترتيب</button></div>':`<div class="locked-note">${res?.ok?"✓ إجابة صحيحة + "+res.score+" نقطة":"هذه المرة لم تصب الإجابة"}</div>`}
 </section>`;
 if(host)document.getElementById("lb").onclick=()=>act("leaderboard");
}
function board(s,host){
 const arr=[...s.teams].sort((a,b)=>b.score-a.score||a.totalTime-b.totalTime);
 app.innerHTML=`<section class="panel"><h2>الترتيب</h2><div class="race">${arr.map((t,i)=>`<div class="race-row"><div><strong>${i+1}. ${t.symbol} ${t.name}</strong></div><span class="score-badge">${t.score} نقطة</span></div>`).join("")}</div>
 ${host?`<div class="actions"><button id="next" class="btn primary">${s.q===QUESTIONS.length-1?"النتيجة النهائية":"السؤال التالي"}</button></div>`:'<p class="center muted">بانتظار المعلمة للمتابعة</p>'}</section>`;
 if(host)document.getElementById("next").onclick=()=>act(s.q===QUESTIONS.length-1?"finish":"next");
}
function final(s,host){
 const arr=[...s.teams].sort((a,b)=>b.score-a.score||a.totalTime-b.totalTime),w=arr[0];
 if(host&&!winnerPlayed){winnerPlayed=true;playAudio("winner")}
 app.innerHTML=`<section class="panel"><div class="winner"><div class="muted">بطلات تبسيط الكسور</div><h2>${w?.symbol||""} ${w?.name||"—"}</h2><strong>${w?.score||0} نقطة</strong></div>
 <div class="race">${arr.map((t,i)=>`<div class="race-row"><strong>${i+1}. ${t.symbol} ${t.name}</strong><span class="score-badge">${t.score} نقطة • ${t.correct} صحيحة</span></div>`).join("")}</div></section>`;
}
function act(action){const x=JSON.parse(sessionStorage.host);send("host_action",{...x,action})}
sock();route();
