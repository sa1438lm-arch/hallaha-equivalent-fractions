const QUESTIONS=[
 {cat:"تفكير عليا",html:"إذا كان الكسران متكافئين، فما العدد المناسب في الفراغ؟<br><br><span class='math-inline'><span class='frac'><span class='num'>٦</span><span class='line'></span><span class='den'>٨</span></span> = <span class='frac'><span class='num'>٩</span><span class='line'></span><span class='den'><span class='blank-box'>؟</span></span></span></span>",options:["١٠","١٢","١٤","١٦"],why:"نبسّط ٦/٨ إلى ٣/٤. وللوصول من ٣ إلى ٩ نضرب في ٣، لذلك نضرب ٤ في ٣ أيضًا؛ فيكون العدد المناسب ١٢."},
 {cat:"مفهوم التبسيط",text:"ما المقصود بتبسيط الكسر الاعتيادي؟",options:["كتابة كسر مكافئ له في أبسط صورة.","جمع البسط والمقام.","تغيير المقام فقط.","ضرب البسط فقط."],why:"تبسيط الكسر يعني كتابة كسر مكافئ له لا يوجد للبسط والمقام فيه قاسم مشترك أكبر من ١."},
 {cat:"خطوات التبسيط",text:"كيف نبسّط الكسر الاعتيادي باستعمال القاسم المشترك الأكبر؟",options:["نقسم البسط والمقام على القاسم المشترك الأكبر.","نقسم البسط فقط.","نقسم المقام فقط.","نجمع البسط والمقام."],why:"نقسم البسط والمقام على القاسم المشترك الأكبر نفسه حتى نحصل على كسر مكافئ في أبسط صورة."},
 {cat:"تبسيط الكسور",html:"بسّطي الكسر:<br><br><span class='math-inline'><span class='frac'><span class='num'>٤</span><span class='line'></span><span class='den'>٨</span></span></span>",options:["<span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'>٢</span></span>","<span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'>٣</span></span>","<span class='frac'><span class='num'>٣</span><span class='line'></span><span class='den'>٤</span></span>","<span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'>٤</span></span>"],why:"القاسم المشترك الأكبر للعددين ٤ و٨ هو ٤. نقسم ٤ ÷ ٤ = ١، و٨ ÷ ٤ = ٢؛ إذن أبسط صورة هي ١/٢."},
 {cat:"تبسيط الكسور",html:"بسّطي الكسر:<br><br><span class='math-inline'><span class='frac'><span class='num'>٨</span><span class='line'></span><span class='den'>١٢</span></span></span>",options:["<span class='frac'><span class='num'>١</span><span class='line'></span><span class='den'>٢</span></span>","<span class='frac'><span class='num'>٢</span><span class='line'></span><span class='den'>٣</span></span>","<span class='frac'><span class='num'>٣</span><span class='line'></span><span class='den'>٤</span></span>","<span class='frac'><span class='num'>٤</span><span class='line'></span><span class='den'>٥</span></span>"],why:"القاسم المشترك الأكبر للعددين ٨ و١٢ هو ٤. نقسم ٨ ÷ ٤ = ٢، و١٢ ÷ ٤ = ٣؛ إذن أبسط صورة هي ٢/٣."}
];

const app=document.getElementById("app"),toastEl=document.getElementById("toast"),soundBtn=document.getElementById("soundBtn");
let ws=null,state=null,timer=null,soundEnabled=localStorage.getItem("hallaha_sound")!=="off",winnerPlayed=false,desiredTeams=5;
const audios={lobby:new Audio("/audio/lobby.mp3"),start:new Audio("/audio/start.mp3"),winner:new Audio("/audio/winner.mp3")};
audios.lobby.loop=true;audios.lobby.volume=.18;audios.start.volume=.55;audios.winner.volume=.58;
const LETTERS=["أ","ب","ج","د"];

function arabicDigits(v){return String(v).replace(/\d/g,d=>"٠١٢٣٤٥٦٧٨٩"[d])}
function toast(m){toastEl.textContent=m;toastEl.classList.add("show");setTimeout(()=>toastEl.classList.remove("show"),2200)}
function isHost(){return location.hash.startsWith("#/host")}
function playAudio(name){if(!isHost()||!soundEnabled)return;const a=audios[name];if(!a)return;if(name!=="lobby")a.currentTime=0;a.play().catch(()=>toast("اضغطي «اختبار» لتفعيل الصوت في المتصفح"))}
function stopAudio(name){const a=audios[name];if(a){a.pause();if(name!=="lobby")a.currentTime=0}}
function stopAll(){Object.values(audios).forEach(a=>a.pause())}
function updateSoundButton(){soundBtn.textContent=(soundEnabled?"🔊":"🔇")+" الصوت"}
soundBtn.onclick=()=>{soundEnabled=!soundEnabled;localStorage.setItem("hallaha_sound",soundEnabled?"on":"off");if(!soundEnabled)stopAll();updateSoundButton();toast(soundEnabled?"تم تشغيل الصوت":"تم إيقاف الصوت")};
document.getElementById("testSound").onclick=()=>{if(!soundEnabled){soundEnabled=true;localStorage.setItem("hallaha_sound","on");updateSoundButton()}if(isHost())playAudio("start");else toast("اختبار الصوت يظهر عند دخول المعلمة")};
updateSoundButton();

function updateDate(){
 const now=new Date(),g=new Intl.DateTimeFormat("ar-SA-u-nu-arab",{day:"numeric",month:"long",year:"numeric"}).format(now);
 let h="";try{h=new Intl.DateTimeFormat("ar-SA-u-ca-islamic-umalqura-nu-arab",{day:"numeric",month:"long",year:"numeric"}).format(now)}catch{}
 document.getElementById("dateBox").innerHTML=`${h?"هـ "+h+"<br>":""}م ${g}<br>🕘 ${new Intl.DateTimeFormat("ar-SA-u-nu-arab",{hour:"numeric",minute:"2-digit"}).format(now)}`;
}
updateDate();setInterval(updateDate,60000);

function sock(){if(ws&&ws.readyState<2)return ws;ws=new WebSocket((location.protocol==="https:"?"wss://":"ws://")+location.host);ws.onmessage=e=>handle(JSON.parse(e.data));ws.onclose=()=>setTimeout(()=>{ws=null;sock()},900);return ws}
function send(type,data={}){const p=JSON.stringify({type,...data}),s=sock();if(s.readyState===1)s.send(p);else s.addEventListener("open",()=>s.send(p),{once:true})}
function handle(m){
 if(m.type==="error")return toast(m.message);
 if(m.type==="created"){sessionStorage.host=JSON.stringify({id:m.id,hostToken:m.hostToken});location.hash="#/host/session/"+m.id}
 if(m.type==="code_result"){if(!m.ok)return toast("رمز الجلسة غير صحيح");teamNamePage(m.id)}
 if(m.type==="joined"){localStorage.team=JSON.stringify({id:m.id,teamId:m.teamId,token:m.token});location.hash="#/play/"+m.id}
 if(m.type==="state"){state=m;renderState()}
}
function route(){clearInterval(timer);state=null;const h=location.hash||"#/";if(h==="#/")home();else if(h==="#/host")hostHome();else if(h==="#/join")joinPage();else if(h.startsWith("#/host/session/")){const x=JSON.parse(sessionStorage.host||"null");if(!x)return location.hash="#/host";send("host_reconnect",x)}else if(h.startsWith("#/play/")){const x=JSON.parse(localStorage.team||"null");if(!x)return location.hash="#/join";send("team_reconnect",x)}}
addEventListener("hashchange",route);

function home(){stopAudio("lobby");app.innerHTML=`
 <section class="home-hero">
  <div class="home-bulb">💡</div><div class="eyebrow">تحدٍ تعليمي تفاعلي</div>
  <div class="logo-word">حلّها</div>
  <div class="home-subtitle">تحدي تبسيط الكسور بطريقة ممتعة وتعاونية</div>
  <div class="home-meta"><span class="meta-pill">١٤ سؤالًا</span><span class="meta-pill">٢٠ ثانية لكل سؤال</span><span class="meta-pill">تحدٍ تفاعلي</span></div>
  <div class="home-cards">
   <a class="home-card" href="#/host"><span class="icon">👩‍🏫</span><strong>دخول المعلمة</strong><small>إنشاء الجلسة وإدارة التحدي</small><span class="go">ابدئي الآن ←</span></a>
   <a class="home-card" href="#/join"><span class="icon">👭</span><strong>دخول الطالبات</strong><small>الانضمام برمز الجلسة واختيار المجموعة</small><span class="go">انضمي الآن ←</span></a>
  </div>
 </section>`}

function hostHome(){stopAudio("lobby");app.innerHTML=`
 <section class="panel form-wrap center">
  <a href="#/" class="muted">← العودة</a><div class="form-icon">👥</div><div class="kicker">إعداد التحدي</div>
  <h1 class="form-title">كم مجموعة ستشارك اليوم؟</h1><p class="muted">حددي عدد المجموعات ثم أنشئي الجلسة ليظهر رمز الانضمام للطالبات.</p>
  <div class="counter"><button id="plus">+</button><div><strong id="teamCount">٥</strong><small>مجموعات</small></div><button id="minus">−</button></div>
  <p class="muted">من ٢ إلى ٥ مجموعات</p><button id="create" class="btn gold" style="width:100%">✨ إنشاء الجلسة</button>
 </section>`;
 const paint=()=>document.getElementById("teamCount").textContent=arabicDigits(desiredTeams);
 document.getElementById("plus").onclick=()=>{desiredTeams=Math.min(5,desiredTeams+1);paint()};document.getElementById("minus").onclick=()=>{desiredTeams=Math.max(2,desiredTeams-1);paint()};
 document.getElementById("create").onclick=()=>send("create",{maxTeams:desiredTeams});
}
function joinPage(){app.innerHTML=`
 <section class="panel form-wrap center"><a href="#/" class="muted">← العودة</a><div class="form-icon">🔐</div><div class="kicker">الخطوة الأولى</div><h1 class="form-title">انضمي إلى التحدي</h1><p class="muted">أدخلي رمز الجلسة المكوّن من ٦ أرقام.</p>
 <div class="step-tabs"><div class="step-tab active"><span class="step-num">١</span>رمز الجلسة</div><div class="step-tab"><span class="step-num">٢</span>اسم المجموعة</div></div>
 <div class="join-hint"><label><strong>رمز الجلسة</strong></label><input id="joinCode" class="input" maxlength="6" inputmode="numeric" autocomplete="off" placeholder="مثال: ١٢٣٤٥٦"><p class="muted" style="font-size:12px">سيتم التحقق من الرمز عند الانضمام النهائي</p><button id="enter" class="btn primary" style="width:100%">دخول إلى الجلسة</button></div></section>`;
 document.getElementById("enter").onclick=()=>send("check_code",{code:document.getElementById("joinCode").value.replace(/[٠-٩]/g,d=>"٠١٢٣٤٥٦٧٨٩".indexOf(d)).trim()});
}
function teamNamePage(id){const names=["المتفوقات","العبقريات","المبدعات","الذكيات","المتميزات"];app.innerHTML=`
 <section class="panel form-wrap center"><a href="#/join" class="muted">← تغيير الرمز</a><div class="form-icon">👭</div><div class="kicker">الخطوة الثانية</div><h1 class="form-title">اختاري اسم المجموعة</h1><p class="muted">اختاري اسمًا مميزًا لمجموعتك ثم أكملي الانضمام.</p>
 <div class="step-tabs"><div class="step-tab"><span class="step-num">١</span>رمز الجلسة</div><div class="step-tab active"><span class="step-num">٢</span>اسم المجموعة</div></div>
 <div class="join-hint"><div class="muted" style="font-size:12px">🔑 رمز الجلسة معتمد</div><label style="display:block;margin:14px 0 5px"><strong>اسم المجموعة</strong></label><input id="teamName" class="input" maxlength="30" autocomplete="off" placeholder="اكتبي اسم المجموعة"><div class="suggestions">${names.map(n=>`<button class="suggestion" data-name="${n}">${n}</button>`).join("")}</div><button id="joinTeam" class="btn gold" style="width:100%">✨ انضمام</button></div></section>`;
 document.querySelectorAll(".suggestion").forEach(b=>b.onclick=()=>document.getElementById("teamName").value=b.dataset.name);
 document.getElementById("joinTeam").onclick=()=>{const name=document.getElementById("teamName").value.trim();if(!name)return toast("اكتبي اسم المجموعة");send("join",{id,name})};
}
function renderState(){const s=state.state,host=isHost();if(s.status==="waiting")return host?hostLobby(s):teamWait(state.team);if(s.status==="question_active")return host?hostQuestion(s):teamQuestion(s,state.answer);if(s.status==="question_reveal")return reveal(s,host,state.result);if(s.status==="leaderboard")return board(s,host);if(s.status==="finished")return final(s,host)}

function hostLobby(s){playAudio("lobby");const target=s.maxTeams||5;app.innerHTML=`<section class="panel lobby-card"><span class="ready-pill">✨ جاهزون للانطلاق</span><h2 style="margin-bottom:0">رمز الجلسة</h2><div class="session-code">${arabicDigits(s.code)}</div><strong>${arabicDigits(s.teams.length)} / ${arabicDigits(target)} مجموعات</strong><p class="muted">في انتظار انضمام المجموعات...</p><div class="team-grid">${s.teams.map(t=>`<div class="team-card"><div class="team-left"><span class="symbol">${t.symbol}</span>${t.name}</div><span class="tiny">✓ متصلة</span></div>`).join("")}</div><button id="start" class="btn gold" style="width:100%" ${s.teams.length<2?"disabled":""}>▶ ابدئي التحدي</button></section>`;document.getElementById("start").onclick=()=>{stopAudio("lobby");playAudio("start");act("start")}}
function teamWait(t){app.innerHTML=`<section class="panel wait-card"><div class="wait-icon">✨</div><div class="kicker">تم الانضمام بنجاح</div><h1 class="form-title">${t.symbol} ${t.name}</h1><p class="muted">بانتظار المعلمة لبدء التحدي...</p></section>`}

function timerMarkup(){return `<div class="timer-ring" id="timerRing"><div class="timer-inner"><span id="time">٢٠</span><small>ثانية</small></div></div>`}
function countdown(start){clearInterval(timer);const tick=()=>{const r=Math.max(0,20000-(Date.now()-start)),sec=Math.ceil(r/1000),pct=r/20000*100,te=document.getElementById("time"),ring=document.getElementById("timerRing");if(te)te.textContent=arabicDigits(sec);if(ring){ring.style.setProperty("--p",pct);ring.classList.toggle("warn",sec<=10&&sec>5);ring.classList.toggle("danger",sec<=5)}};tick();timer=setInterval(tick,150)}
function monitor(s,answered){const done=answered.size===s.teams.length&&s.teams.length>0;return `<aside class="monitor-card"><div class="monitor-title">👥 متابعة إجابات المجموعات</div><div class="response-box ${done?"complete":""}"><div style="font-size:28px">${done?"✅":"⌛"}</div><div class="muted">الإجابات</div><div class="count">${arabicDigits(answered.size)} / ${arabicDigits(s.teams.length)}</div><div class="monitor-status">${done?"اكتملت إجابات جميع المجموعات":"بانتظار بقية المجموعات"}</div></div><div class="monitor-list">${s.teams.map((t,i)=>`<div class="monitor-team ${answered.has(t.id)?"done":""}"><div><strong>${t.symbol} ${t.name}</strong></div><span class="monitor-status">${answered.has(t.id)?"✅ تمت الإجابة":"⌛ بانتظار الإجابة"}</span></div>`).join("")}</div></aside>`}
function answersMarkup(q,{disabled=false,selected=null,correct=null}={}){return `<div class="answers">${q.options.map((o,i)=>`<button class="answer ${selected===i?"selected":""} ${correct===i?"correct":""}" data-i="${i}" ${disabled?"disabled":""}><span class="letter">${LETTERS[i]}</span>${o}</button>`).join("")}</div>`}
function hostQuestion(s){stopAudio("lobby");const q=QUESTIONS[s.q],answered=new Set(state.answered||[]),progress=(s.q+1)/QUESTIONS.length*100;app.innerHTML=`<section class="host-layout">${monitor(s,answered)}<section class="panel question-panel"><div class="q-head">${timerMarkup()}<span class="category-pill">📚 ${q.cat}</span><span class="q-pill">📖 السؤال ${arabicDigits(s.q+1)} من ${arabicDigits(QUESTIONS.length)}</span></div><div class="progress-track"><div style="width:${progress}%"></div></div><div class="question-text">${q.html||q.text}</div>${answersMarkup(q,{disabled:true})}<div class="locked-note">⏱️ يمكنك الانتقال بعد انتهاء الوقت أو اكتمال إجابات المجموعات.</div></section></section>`;countdown(s.started)}
function teamQuestion(s,ans){const q=QUESTIONS[s.q],progress=(s.q+1)/QUESTIONS.length*100;app.innerHTML=`<section class="panel question-panel" style="max-width:1100px;margin:auto"><div class="q-head">${timerMarkup()}<span class="category-pill">📚 ${q.cat}</span><span class="q-pill">📖 السؤال ${arabicDigits(s.q+1)} من ${arabicDigits(QUESTIONS.length)}</span></div><div class="progress-track"><div style="width:${progress}%"></div></div><div class="question-text">${q.html||q.text}</div>${answersMarkup(q,{disabled:!!ans,selected:ans?.choice})}${ans?'<div class="locked-note">تم اعتماد الإجابة ✓ بانتظار بقية المجموعات</div>':""}</section>`;countdown(s.started);if(!ans)document.querySelectorAll(".answer").forEach(b=>b.onclick=()=>{const saved=JSON.parse(localStorage.team);document.querySelectorAll(".answer").forEach(x=>x.disabled=true);b.classList.add("selected");send("answer",{...saved,choice:Number(b.dataset.i)})})}

function reveal(s,host,res){const q=QUESTIONS[s.q],ci=state.correctIndex??0;clearInterval(timer);if(!host){app.innerHTML=`<section class="panel wait-card"><div class="wait-icon">⌛</div><div class="kicker">أحسنتم</div><h1 class="form-title">تم انتهاء السؤال</h1><p class="muted">انتظروا انتقال المعلمة إلى السؤال التالي.</p>${res?`<div class="locked-note">${res.ok?"✅ إجابة صحيحة + "+arabicDigits(res.score)+" نقطة":"تم تسجيل الإجابة"}</div>`:""}</section>`;return}
 const answered=new Set(s.teams.map(t=>t.id));app.innerHTML=`<section class="host-layout">${monitor(s,answered)}<section class="panel question-panel"><div class="reveal-title"><span class="correct-mark">✓</span><span class="category-pill">👭 ${q.cat}</span><span class="q-pill">💡 كشف الحل</span></div><div class="question-text">${q.html||q.text}</div>${answersMarkup(q,{disabled:true,correct:ci})}<div class="teacher-note"><strong>💡 كشف الحل (للمعلمة فقط)</strong><br>${q.why}</div><button id="lb" class="btn primary next-wide">عرض الترتيب ◀</button></section></section>`;document.getElementById("lb").onclick=()=>act("leaderboard")}
function board(s,host){const arr=[...s.teams].sort((a,b)=>b.score-a.score||a.totalTime-b.totalTime);app.innerHTML=`<section class="panel" style="max-width:900px;margin:auto"><h1 class="form-title center">ترتيب المجموعات</h1><div class="race">${arr.map((t,i)=>`<div class="race-row"><strong>${arabicDigits(i+1)}. ${t.symbol} ${t.name}</strong><span class="score-badge">${arabicDigits(t.score)} نقطة</span></div>`).join("")}</div>${host?`<button id="next" class="btn primary next-wide">${s.q===QUESTIONS.length-1?"النتيجة النهائية":"السؤال التالي ◀"}</button>`:'<p class="center muted">بانتظار المعلمة للمتابعة</p>'}</section>`;if(host)document.getElementById("next").onclick=()=>act(s.q===QUESTIONS.length-1?"finish":"next")}
function final(s,host){const arr=[...s.teams].sort((a,b)=>b.score-a.score||a.totalTime-b.totalTime),w=arr[0];if(host&&!winnerPlayed){winnerPlayed=true;playAudio("winner")}app.innerHTML=`<section class="panel" style="max-width:900px;margin:auto"><div class="winner"><div class="muted">🏆 بطلات تبسيط الكسور</div><h1 class="form-title">${w?.symbol||""} ${w?.name||"—"}</h1><strong>${arabicDigits(w?.score||0)} نقطة</strong></div><div class="race">${arr.map((t,i)=>`<div class="race-row"><strong>${arabicDigits(i+1)}. ${t.symbol} ${t.name}</strong><span class="score-badge">${arabicDigits(t.score)} نقطة • ${arabicDigits(t.correct)} صحيحة</span></div>`).join("")}</div></section>`}
function act(action){const x=JSON.parse(sessionStorage.host||"null");if(x)send("host_action",{...x,action})}
sock();route();
