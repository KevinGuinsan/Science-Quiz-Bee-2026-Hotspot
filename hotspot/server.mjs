import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync,writeFileSync,renameSync,mkdirSync,existsSync} from 'node:fs';
import {createInterface} from 'node:readline/promises';
import {newGame,view,join,submit,action,expire,secret,rankings} from './game.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
export const banks=JSON.parse(readFileSync(path.join(root,'banks.json'),'utf8'));
export function privateIP(ip){const a=ip.split('.').map(Number);return a.length===4&&a.every(n=>Number.isInteger(n)&&n>=0&&n<=255)&&(a[0]===10||a[0]===192&&a[1]===168||a[0]===172&&a[1]>=16&&a[1]<=31);}
function ipNumber(ip){return ip.split('.').reduce((n,v)=>(n<<8)|Number(v),0)>>>0;}
export function onSubnet(ip,address,mask){return privateIP(ip)&&(ipNumber(ip)&ipNumber(mask))===(ipNumber(address)&ipNumber(mask));}
export function interfaces(){return Object.entries(os.networkInterfaces()).flatMap(([name,rows])=>rows.filter(x=>x.family==='IPv4'&&!x.internal&&privateIP(x.address)).map(x=>({name,address:x.address,netmask:x.netmask})));}
const files={'/':'player.html','/player.html':'player.html','/player.js':'player.js','/common.js':'common.js','/style.css':'style.css'};
const hostFiles={'/host.html':'host.html','/host.js':'host.js','/qr.js':'../vendor/package/qrcode.js','/qr-utf8.js':'../vendor/package/qrcode_UTF8.js'};
export function createQuiz({bind,mask,port=8080,dataDir=path.join(root,'data'),testing=false}={}){
 if(!testing&&(!privateIP(bind)||!interfaces().some(i=>i.address===bind&&i.netmask===mask)))throw Error('Choose the IPv4 address of the hotspot adapter.');
 let game=null;let diskError=false;const token=secret();const active=path.join(dataDir,'current.json');
 mkdirSync(dataDir,{recursive:true});
 if(existsSync(active)){
  try{game=JSON.parse(readFileSync(active,'utf8'));if(game.version!==1||!Array.isArray(game.players)||!Array.isArray(game.questions)||!game.questions.length||!game.results)throw Error('Invalid session');}
  catch{throw Error('Cannot read saved session. Preserve hotspot/data/current.json for recovery before starting a new server.');}
  if(game.phase==='running'){game.remaining=Math.max(0,game.end-Date.now());game.end=null;game.phase=game.remaining?'paused':'closed';}
 }
 function save(){try{writeFileSync(active+'.tmp',JSON.stringify(game));renameSync(active+'.tmp',active);diskError=false;}catch{diskError=true;}}
 function json(res,status,data){res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(data));}
 async function body(req){if(!String(req.headers['content-type']||'').startsWith('application/json'))throw Error('Send JSON.');let text='';for await(const chunk of req){text+=chunk;if(text.length>4096)throw Error('Request too large.');}return JSON.parse(text||'{}');}
 const throttles=new Map();
 function limited(req){const ip=req.socket.remoteAddress,now=Date.now();let rate=throttles.get(ip);if(!rate||now-rate.time>10000){rate={time:now,count:0};throttles.set(ip,rate);}return ++rate.count>40;}
 const handler=host=>async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Referrer-Policy','no-referrer');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'self'");
  const expected=`${host?'127.0.0.1':bind}:${req.socket.localPort}`;
  if(req.headers.host!==expected||req.headers.origin&&req.headers.origin!==`http://${expected}`){json(res,403,{error:'Use the address shown by the host.'});return;}
  if(!host&&!testing&&!onSubnet(req.socket.remoteAddress,bind,mask)){json(res,403,{error:'Join the host Wi-Fi hotspot first.'});return;}
  const url=new URL(req.url,`http://${expected}`);
  if(req.method==='POST'&&limited(req)){json(res,429,{error:'Too many requests. Wait a few seconds.'});return;}
  try{
   if(expire(game))save();
   if(url.pathname.startsWith('/api/host')){
    if(!host||req.headers.authorization!==`Bearer ${token}`){json(res,403,{error:'Host controls are available only from the laptop launcher.'});return;}
    if(url.pathname==='/api/host/state'&&req.method==='GET'){
     json(res,200,{...view(game,null,true),sets:Object.entries(banks).map(([key,b])=>({key,label:b.label,count:b.questions.length})),joinURL:`http://${bind}:${lanServer.address()?.port??port}/`,adapter:bind,diskError});return;
    }
    if(url.pathname==='/api/host/create'&&req.method==='POST'){
     const data=await body(req);if(!banks[data.set])throw Error('Select a question set.');
     const name=String(data.name||'').trim();if(name.length>80)throw Error('Session name is too long.');
     if(game)writeFileSync(path.join(dataDir,game.id+'.json'),JSON.stringify(game));
     game=newGame(data.set,banks[data.set],name);save();json(res,200,{ok:true});return;
    }
    if(url.pathname==='/api/host/action'&&req.method==='POST'){
     const data=await body(req);action(game,data.type,data.value);save();json(res,200,{ok:true});return;
    }
    if(url.pathname==='/api/host/export'&&req.method==='GET'){
     if(!game)throw Error('No session.');
     const cell=x=>'"'+String(x??'').replace(/^[\s]*[=+@-]/,"'$&").replaceAll('"','""')+'"';
     const rows=[['Name','Section','Score',...game.questions.map(q=>'Q'+q.id)],...rankings(game).map(p=>[p.name,p.section,p.score,...game.questions.map(q=>game.results[q.id]?.[p.id]??'')])];
     res.writeHead(200,{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':'attachment; filename="quiz-scores.csv"'});res.end('\uFEFF'+rows.map(row=>row.map(cell).join(',')).join('\r\n'));return;
    }
    json(res,404,{error:'Not found'});return;
   }
   if(url.pathname==='/api/join'&&req.method==='POST'){
    const data=await body(req);const p=join(game,data.name,data.section);save();json(res,200,{token:p.token});return;
   }
   if(url.pathname==='/api/state'&&req.method==='GET'||url.pathname==='/api/answer'&&req.method==='POST'){
    const player=game?.players.find(p=>req.headers.authorization===`Bearer ${p.token}`);
    if(!player){json(res,401,{error:'Join the current session first.'});return;}
    if(req.method==='POST'){const data=await body(req);submit(game,player,data.turn,data.answer);save();json(res,200,{ok:true});}
    else json(res,200,view(game,player));return;
   }
   if(req.method!=='GET'){json(res,405,{error:'Method not allowed'});return;}
   const file=files[url.pathname]||(host?hostFiles[url.pathname]:null);
   if(!file){json(res,404,{error:'Not found'});return;}
   const content=readFileSync(path.join(root,'public',file));
   res.writeHead(200,{'Content-Type':file.endsWith('.js')?'text/javascript; charset=utf-8':file.endsWith('.css')?'text/css; charset=utf-8':'text/html; charset=utf-8'});res.end(content);
  }catch(error){json(res,400,{error:error.message});}
 };
 const adminServer=http.createServer(handler(true));const lanServer=http.createServer(handler(false));
 const timer=setInterval(()=>{if(expire(game))save();},100);timer.unref();
 const cleanup=setInterval(()=>{for(const [ip,value]of throttles)if(Date.now()-value.time>10000)throttles.delete(ip);},30000);cleanup.unref();
 const listen=(s,ip)=>new Promise((resolve,reject)=>{s.once('error',reject);s.listen(port,ip,()=>{s.removeListener('error',reject);resolve();});});
 return {token,adminServer,lanServer,start:async()=>{try{await listen(adminServer,'127.0.0.1');await listen(lanServer,bind);}catch(e){adminServer.close();throw e;}},close:async()=>{clearInterval(timer);clearInterval(cleanup);for(const s of[adminServer,lanServer])s.closeAllConnections();await Promise.all([adminServer,lanServer].map(s=>new Promise(resolve=>s.close(resolve))));}};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{
  const choices=interfaces();if(!choices.length)throw Error('No private IPv4 network adapter found. Enable the hotspot first.');
  const arg=process.argv.find(x=>x.startsWith('--bind='))?.slice(7);let choice=choices.find(x=>x.address===arg);
  if(arg&&!choice)throw Error('The requested hotspot IP is not active on this laptop.');
  if(!choice){console.log('Choose the HOTSPOT adapter (not your internet/VPN adapter):');choices.forEach((c,i)=>console.log(`${i+1}. ${c.name} — ${c.address}${c.address==='192.168.137.1'?' (usual Windows hotspot address)':''}`));const rl=createInterface({input:process.stdin,output:process.stdout});const answer=await rl.question('Adapter number: ');rl.close();choice=choices[Number(answer)-1];if(!choice)throw Error('Select a listed adapter number.');}
  const app=createQuiz({bind:choice.address,mask:choice.netmask});await app.start();
  console.log(`\nHOST ONLY — open on this laptop:\nhttp://127.0.0.1:8080/host.html#${app.token}\n\nPLAYERS — join the hotspot first:\nhttp://${choice.address}:8080/\n\nKeep this window open. Ctrl+C stops the quiz server.\nThis app does NOT disable internet sharing or mobile data. Test the hotspot offline before the quiz.`);
  process.on('SIGINT',async()=>{await app.close();process.exit(0);});
 }catch(error){console.error(error.message);process.exitCode=1;}
}
