import {$,el,button,message,api,board,question,timer} from './common.js';
let token=location.hash.slice(1);
try{if(!token)token=sessionStorage.getItem('hotspot-host-token');if(location.hash)sessionStorage.setItem('hotspot-host-token',token);}catch{message('Keep this page open. To reopen it, use the host link in the launcher.');}
if(location.hash)history.replaceState(null,'',location.pathname);
let state=null,received=0,signature='',navSignature='',connected=false;
function qr(id,text){qrcode.stringToBytes=qrcode.stringToBytesFuncs['UTF-8'];const code=qrcode(0,'M');code.addData(text);code.make();$(id).innerHTML=code.createSvgTag({cellSize:4,margin:16,scalable:true});}
$('wifi-form').onsubmit=e=>{e.preventDefault();try{const escape=v=>v.replace(/[\\;,:\"]/g,'\\$&');qr('wifi-qr',`WIFI:T:WPA;S:${escape($('ssid').value)};P:${escape($('wifi-password').value)};;`);$('wifi-note').textContent='Scan this QR to join '+$('ssid').value+'. Then scan the quiz QR below.';}catch{message('These Wi-Fi details could not be encoded. Enter the hotspot name and password manually on each device.');}};
async function command(type,value){try{await api('/api/host/action',token,{type,value});message('');await refresh();}catch(e){message(e.message);}}
$('create-form').onsubmit=async e=>{e.preventDefault();if(state?.id&&!confirm('Archive the current quiz and start a new session with an empty leaderboard?'))return;try{await api('/api/host/create',token,{set:$('set').value,name:$('name').value.trim()});signature='';message('');await refresh();}catch(e){message(e.message);}};
$('start').onclick=()=>command('start');$('pause').onclick=()=>command('pause');
$('reveal').onclick=()=>{if(state.phase==='running'&&!confirm('Stop the timer and reveal the answer now?'))return;command('reveal');};
$('lock').onclick=()=>command('lock',!state.locked);
$('finish').onclick=()=>{if(confirm('Finish this quiz and show the final leaderboard?'))command('finish');};
$('export').onclick=async()=>{try{const r=await fetch('/api/host/export',{headers:{Authorization:`Bearer ${token}`}});if(!r.ok)throw Error('Unable to export scores.');const url=URL.createObjectURL(await r.blob());const a=el('a');a.href=url;a.download='QuizBee-Hotspot-Scores.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){message(e.message);}};
async function refresh(){
 if(!token){message('Open the HOST ONLY link printed by START-HOTSPOT.cmd on this laptop.');return;}
 try{
  const data=await api('/api/host/state',token);state=data;received=performance.now();connected=true;
  $('connection').textContent=data.diskError?'Warning: could not save to disk. Export scores before closing.':'Local server connected · Player network: '+data.adapter;
  if(!$('set').options.length){$('set').replaceChildren(...data.sets.map(s=>{const n=el('option',`${s.label} (${s.count} questions)`);n.value=s.key;return n;}));qr('join-qr',data.joinURL);$('join-url').textContent=data.joinURL;}
  $('game').hidden=data.phase==='none';$('export').disabled=!data.id;
  if(!data.id)return;
  $('session-name').textContent=data.name;
  $('count').textContent=`${data.leaderboard.length} participants`;$('submitted').textContent=`${data.submissions.length} answers submitted`;
  $('lock').textContent=data.locked?'Reopen joining':'Close joining';$('lock').disabled=['running','finished'].includes(data.phase);
  $('finish').disabled=data.phase!=='revealed';$('start').disabled=!['waiting','paused'].includes(data.phase)||!data.leaderboard.length;
  $('start').textContent=data.phase==='paused'?'⏱️ Resume Timer':'⏱️ Start Timer';$('pause').disabled=data.phase!=='running';$('reveal').disabled=['revealed','finished'].includes(data.phase);
  const key=JSON.stringify([data.turn,data.phase,data.leaderboard]);if(key!==signature){signature=key;question(data.question);board(data.leaderboard);$('progress').textContent=`Question ${data.index+1} of ${data.total}`;}
  const navKey=JSON.stringify([data.id,data.index,data.phase,data.questions]);if(navKey!==navSignature){navSignature=navKey;$('navigation').replaceChildren(...data.questions.map(q=>{const b=button(`Q${q.index+1} (${q.category[0]})`,()=>{if(q.scored&&!confirm('Replay this question? Its previous scores will be replaced when you reveal the new answers.'))return;command('select',q.index);});b.disabled=['running','paused','closed'].includes(data.phase);b.className=q.index===data.index?'active':'';return b;}));}
 }catch(e){connected=false;$('connection').textContent='Host disconnected. Keep the server window open.';if(e.status===403)message(e.message);document.querySelectorAll('#game button').forEach(b=>b.disabled=true);}
}
async function poll(){await refresh();setTimeout(poll,800);}poll();
setInterval(()=>{if(connected)timer(state,received);},100);
