import {randomBytes,randomUUID} from 'node:crypto';
export const secret=()=>randomBytes(24).toString('hex');
export function newGame(set,bank,name){return {version:1,id:randomUUID(),name:name||bank.label,set,questions:structuredClone(bank.questions),players:[],index:0,turn:randomUUID(),phase:'waiting',end:null,remaining:null,locked:false,results:{}};}
export function rankings(g){return g.players.map(p=>({id:p.id,name:p.name,section:p.section,score:Object.values(g.results).reduce((n,row)=>n+(row[p.id]||0),0)})).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name)).map((p,i,all)=>({...p,rank:all.findIndex(x=>x.score===p.score)+1}));}
export function view(g,player=null,host=false){
 if(!g)return {phase:'none'};
 const q=g.questions[g.index];
 const data={id:g.id,name:g.name,set:g.set,index:g.index,total:g.questions.length,turn:g.turn,phase:g.phase,end:g.end,remaining:g.remaining,locked:g.locked,leaderboard:rankings(g),question:{id:q.id,question:q.question,options:q.options,category:q.category,seconds:q.seconds,points:q.points}};
 if(g.phase==='revealed'||g.phase==='finished')data.question.answer=typeof q.answer==='number'?`${String.fromCharCode(65+q.answer)}. ${q.options[q.answer]}`:q.answer;
 if(player){data.me={id:player.id,submitted:player.turn===g.turn,answer:player.turn===g.turn?player.answer:null,points:g.results[q.id]?.[player.id]??null};}
 if(host){data.submissions=g.players.filter(p=>p.turn===g.turn).map(p=>p.id);data.questions=g.questions.map((q,i)=>({index:i,category:q.category,scored:Object.hasOwn(g.results,q.id)}));}
 data.serverNow=Date.now();
 if(!host&&g.phase==='waiting')data.question=null;
 return data;
}
export function join(g,name,section){
 if(!g||g.locked||g.phase==='running'||g.phase==='finished')throw Error('Joining is closed. Ask the host to reopen the lobby.');
 name=String(name||'').trim();section=String(section||'').trim();
 if(!name||name.length>80||section.length>60)throw Error('Enter a name (up to 80 characters) and an optional section.');
 if(g.players.length>=100)throw Error('This session has reached its participant limit.');
 if(g.players.some(p=>p.name.toLowerCase()===name.toLowerCase()&&p.section.toLowerCase()===section.toLowerCase()))throw Error('That participant already joined. Use the original browser to reconnect, or ask the host.');
 const p={id:randomUUID(),token:secret(),name,section,turn:null,answer:null};g.players.push(p);return p;
}
export function submit(g,p,turn,answer,now=Date.now()){
 if(!g||g.phase!=='running'||now>=g.end)throw Error('Answers are closed.');
 if(turn!==g.turn)throw Error('That question has ended. Wait for the current question.');
 if(p.turn===turn)throw Error('Your answer has already been submitted.');
 const q=g.questions[g.index];
 if(q.options.length){if(!Number.isInteger(answer)||answer<0||answer>=q.options.length)throw Error('Choose an answer.');}
 else if(typeof answer!=='string'||!answer.trim()||answer.length>200)throw Error('Enter an answer (up to 200 characters).');
 p.answer=typeof answer==='string'?answer.trim():answer;p.turn=turn;
}
export function action(g,type,value,now=Date.now()){
 if(!g)throw Error('Create a session first.');
 const q=g.questions[g.index];
 if(type==='start'){
  if(!g.players.length)throw Error('Wait for at least one participant.');
  if(g.phase!=='waiting'&&g.phase!=='paused')throw Error('Select a question before starting.');
  g.locked=true;g.end=now+(g.remaining??q.seconds*1000);g.remaining=null;g.phase='running';
 }else if(type==='pause'){
  if(g.phase!=='running')throw Error('The timer is not running.');g.remaining=Math.max(0,g.end-now);g.end=null;g.phase=g.remaining?'paused':'closed';
 }else if(type==='reveal'){
  if(g.phase==='finished')throw Error('This session has finished.');
  if(g.phase==='revealed')return;
  const row={};for(const p of g.players){const correct=p.turn===g.turn&&(q.options.length?p.answer===q.answer:String(p.answer).trim().toLowerCase()===String(q.answer).trim().toLowerCase());row[p.id]=correct?q.points:0;}
  g.results[q.id]=row;g.end=null;g.remaining=null;g.phase='revealed';
 }else if(type==='select'){
  if(!Number.isInteger(value)||value<0||value>=g.questions.length)throw Error('Unknown question.');
  if(['running','paused','closed'].includes(g.phase))throw Error('Reveal and score the current question first.');
  g.index=value;g.turn=randomUUID();g.end=null;g.remaining=null;g.phase='waiting';
 }else if(type==='lock'){
  if(g.phase==='running'||g.phase==='finished')throw Error('Stop the round before changing the lobby.');g.locked=!!value;
 }else if(type==='finish'){
  if(g.phase!=='revealed')throw Error('Reveal and score the current question first.');g.phase='finished';g.locked=true;
 }else throw Error('Unknown action.');
}
export function expire(g,now=Date.now()){if(g?.phase==='running'&&now>=g.end){g.phase='closed';g.end=null;return true;}return false;}
