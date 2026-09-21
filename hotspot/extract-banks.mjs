import vm from 'node:vm';
import {readFileSync,writeFileSync} from 'node:fs';
const g7=vm.runInNewContext(readFileSync('grade7/questions.js','utf8').replace(/export /g,'')+';questions');
const g11=vm.runInNewContext(readFileSync('grade11/questions.js','utf8')+';rawQuestionBank');
const clean=qs=>qs.map((q,i)=>({id:String(i+1),question:q.question,options:q.options||[],answer:q.answer,category:(q.category||q.round.replace(' Round','')).toUpperCase(),seconds:q.timeLimit||q.timer,points:q.points}));
writeFileSync('hotspot/banks.json',JSON.stringify({'g7':{label:'Grade 7 · Set A',questions:clean(g7)},'g11-1':{label:'Grade 11 · Set A',questions:clean(g11[1])},'g11-2':{label:'Grade 11 · Set B',questions:clean(g11[2])},'g11-3':{label:'Grade 11 · Set C',questions:clean(g11[3])}},null,2));
