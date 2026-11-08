
const http=require("http"),fs=require("fs"),path=require("path");
const {WebSocketServer}=require("ws");
const PORT=process.env.PORT||3000;
const sessions=new Map(),SYMBOLS=["◆","✦","⬡","◈","✧"];
const ANSWERS=[0,1,2,0,0,1,0,2,1,1,0,0,1,0];

const MIME={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"application/javascript; charset=utf-8",".mp3":"audio/mpeg"};
const server=http.createServer((req,res)=>{
 let p=new URL(req.url,`http://${req.headers.host}`).pathname;
 if(p==="/")p="/index.html";
 const f=path.join(__dirname,p);
 if(!f.startsWith(__dirname)){res.writeHead(403);return res.end("Forbidden")}
 fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);return res.end("Not found")}res.writeHead(200,{"Content-Type":MIME[path.extname(f)]||"application/octet-stream"});res.end(d)})
});
const wss=new WebSocketServer({server});
const id=()=>Math.random().toString(36).slice(2)+Date.now().toString(36);
function makeCode(){let c;do c=String(Math.floor(Math.random()*1e6)).padStart(6,"0");while([...sessions.values()].some(s=>s.code===c&&s.status!=="finished"));return c}
function send(ws,type,data={}){if(ws?.readyState===1)ws.send(JSON.stringify({type,...data}))}
function pub(t){return{id:t.id,name:t.name,symbol:t.symbol,score:t.score,totalTime:t.totalTime,correct:t.correct}}
function broadcast(s){
 const st={id:s.id,code:s.code,status:s.status,q:s.q,started:s.started,teams:[...s.teams.values()].map(pub)};
 send(s.host,"state",{state:st,answered:[...s.answered],correctIndex:s.status!=="question_active"?ANSWERS[s.q]:undefined,correctLabel:s.status!=="question_active"?String.fromCharCode(65+ANSWERS[s.q]):undefined});
 for(const t of s.teams.values()){
  const a=t.answers.find(x=>x.q===s.q);
  send(t.ws,"state",{state:st,team:pub(t),answer:a?{choice:a.choice}:null,result:s.status!=="question_active"&&a?{ok:a.ok,score:a.points}:null,correctIndex:s.status!=="question_active"?ANSWERS[s.q]:undefined});
 }
}
function startQ(s,q){
 s.q=q;s.status="question_active";s.started=Date.now();s.answered=new Set();clearTimeout(s.timer);
 s.timer=setTimeout(()=>{if(s.status==="question_active"){s.status="question_reveal";broadcast(s)}},20000);broadcast(s)
}
wss.on("connection",ws=>{
 ws.on("message",raw=>{
  let m;try{m=JSON.parse(raw)}catch{return}
  if(m.type==="create"){
   const s={id:id(),code:makeCode(),hostToken:id(),host:ws,status:"waiting",q:0,started:null,teams:new Map(),answered:new Set()};
   sessions.set(s.id,s);send(ws,"created",{id:s.id,code:s.code,hostToken:s.hostToken});broadcast(s);return;
  }
  if(m.type==="host_reconnect"){const s=sessions.get(m.id);if(s&&s.hostToken===m.hostToken){s.host=ws;broadcast(s)}return}
  if(m.type==="check_code"){const s=[...sessions.values()].find(x=>x.code===String(m.code)&&x.status==="waiting");return send(ws,"code_result",{ok:!!s,id:s?.id})}
  if(m.type==="join"){
   const s=sessions.get(m.id);if(!s||s.status!=="waiting")return send(ws,"error",{message:"الجلسة غير متاحة"});
   if(s.teams.size>=5)return send(ws,"error",{message:"اكتمل عدد المجموعات"});
   const name=String(m.name||"").trim();if(!name)return send(ws,"error",{message:"اكتبي اسم المجموعة"});
   if([...s.teams.values()].some(t=>t.name.toLowerCase()===name.toLowerCase()))return send(ws,"error",{message:"اسم المجموعة مستخدم بالفعل"});
   const t={id:id(),token:id(),name,symbol:SYMBOLS[s.teams.size],score:0,totalTime:0,correct:0,answers:[],ws};s.teams.set(t.id,t);
   send(ws,"joined",{id:s.id,teamId:t.id,token:t.token});broadcast(s);return;
  }
  if(m.type==="team_reconnect"){const s=sessions.get(m.id),t=s?.teams.get(m.teamId);if(t&&t.token===m.token){t.ws=ws;broadcast(s)}return}
  if(m.type==="host_action"){
   const s=sessions.get(m.id);if(!s||s.hostToken!==m.hostToken)return;
   if(m.action==="start"&&s.status==="waiting"&&s.teams.size>=2)startQ(s,0);
   else if(m.action==="leaderboard"&&s.status==="question_reveal"){s.status="leaderboard";broadcast(s)}
   else if(m.action==="next"&&s.status==="leaderboard"&&s.q<13)startQ(s,s.q+1);
   else if(m.action==="finish"&&s.status==="leaderboard"&&s.q===13){s.status="finished";broadcast(s)}
   return;
  }
  if(m.type==="answer"){
   const s=sessions.get(m.id),t=s?.teams.get(m.teamId);if(!s||!t||t.token!==m.token||s.status!=="question_active")return;
   if(t.answers.some(a=>a.q===s.q))return;
   const elapsed=Math.min(20000,Math.max(0,Date.now()-s.started)),choice=Number(m.choice),ok=choice===ANSWERS[s.q];
   const points=ok?Math.round(500+500*(20000-elapsed)/20000):0;
   t.answers.push({q:s.q,choice,ok,points});t.score+=points;t.totalTime+=elapsed;if(ok)t.correct++;s.answered.add(t.id);broadcast(s);
   if(s.answered.size===s.teams.size){clearTimeout(s.timer);s.status="question_reveal";broadcast(s)}
  }
 })
});
server.listen(PORT,"0.0.0.0",()=>console.log(`حلّها تعمل على http://localhost:${PORT}`));
