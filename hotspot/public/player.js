import {$,el,button,message,api,board,timer} from './common.js';
let token=null,state=null,received=0,turn='',selection=null,connected=false;
try{token=localStorage.getItem('hotspot-player-token');}catch{message('Keep this page open: browser storage is unavailable.');}
function lock(){document.querySelectorAll('#answer-form input,#answer-form button,#options button').forEach(n=>n.disabled=true);}
$('join-form').onsubmit=async e=>{e.preventDefault();try{const data=await api('/api/join',null,{name:$('name').value,section:$('section').value});token=data.token;try{localStorage.setItem('hotspot-player-token',token);}catch{message('Keep this page open: this browser cannot save your reconnect key.');}await refresh();}catch(e){message(e.message);}};
$('answer-form').onsubmit=async e=>{e.preventDefault();if(!connected||!state?.question)return;const answer=state.question.options.length?selection:$('text-answer').value.trim();if(answer===null||answer==='')return message('Choose or enter an answer first.');if(!confirm('Submit this as your final answer?'))return;lock();try{await api('/api/answer',token,{turn:state.turn,answer});message('');await refresh();}catch(e){message(e.message);await refresh();}};
function render(){
 $('join-form').hidden=true;$('game').hidden=false;$('session-name').textContent=state.name;$('progress').textContent=`Question ${state.index+1} of ${state.total}`;
 const q=state.question;
 if(turn!==state.turn){turn=state.turn;selection=null;$('text-answer').value='';$('options').replaceChildren();}
 $('question').textContent=q?.question||'Waiting for the host to start the question…';$('round').textContent=q?`${q.category} · ${q.points} points`:'';
 if(q?.options.length&&!$('options').childElementCount){$('options').replaceChildren(...q.options.map((text,i)=>{const b=button(`${String.fromCharCode(65+i)}. ${text}`,()=>{selection=i;document.querySelectorAll('#options button').forEach((n,j)=>n.classList.toggle('selected',i===j));});b.className='option';return b;}));}
 $('text-label').hidden=!q||!!q.options.length;$('answer-form').hidden=!q||state.phase==='finished';
 const open=state.phase==='running'&&!state.me.submitted;
 document.querySelectorAll('#answer-form input,#answer-form button,#options button').forEach(n=>n.disabled=!open);
 $('submission').textContent=state.me.submitted?'Answer submitted.':state.phase==='closed'?'Time is up. No more answers accepted.':state.phase==='paused'?'Timer paused.':state.phase==='finished'?'Quiz finished.':open?'Choose your answer and submit before time runs out.':'';
 if(state.me.submitted&&q?.options.length){document.querySelectorAll('#options button').forEach((n,i)=>n.classList.toggle('selected',i===state.me.answer));}
 if(state.me.submitted&&q&&!q.options.length)$('text-answer').value=state.me.answer;
 $('answer').hidden=!q?.answer;$('answer').textContent=q?.answer?`Correct answer: ${q.answer} · Your points: ${state.me.points??0}`:'';board(state.leaderboard);
}
async function refresh(){if(!token)return;try{state=await api('/api/state',token);received=performance.now();connected=true;$('connection').textContent='Connected to the host';render();}catch(e){connected=false;lock();$('connection').textContent='Disconnected — reconnect to the host Wi-Fi. Your submitted answer stays saved.';if(e.status===401){token=null;try{localStorage.removeItem('hotspot-player-token');}catch{}$('join-form').hidden=false;$('game').hidden=true;message('The host started a new session. Join again.');}}}
async function poll(){await refresh();setTimeout(poll,650);}poll();
setInterval(()=>{if(connected){timer(state,received);if(state?.phase==='running'&&state.end-state.serverNow-(performance.now()-received)<=0)lock();}},100);
