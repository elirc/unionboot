// 1754 Heap job dispatch / scenario 6 — direction=low; aging=0
// Prompt: ../prompts/1754.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"direction":"low","aging":0};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
check([],[]);const jobs=[{id:'a',arrival:0,duration:3,priority:2},{id:'b',arrival:0,duration:1,priority:0},{id:'c',arrival:2,duration:2,priority:5},{id:'d',arrival:4,duration:1,priority:-3},{id:'e',arrival:30,duration:1,priority:5}];
 function oracle(rows){let todo=rows.map((r,i)=>({...r,i})),now=0,out=[];while(todo.length){if(!todo.some(x=>x.arrival<=now))now=Math.min(...todo.map(x=>x.arrival));const ready=todo.filter(x=>x.arrival<=now);ready.sort((a,b)=>(cfg.direction==='high'?b.priority-a.priority:a.priority-b.priority)+cfg.aging*(a.arrival-b.arrival)||a.i-b.i);const x=ready[0];out.push({id:x.id,start:now,end:now+x.duration});now+=x.duration;todo=todo.filter(y=>y!==x);}return out;}check(jobs,oracle(jobs));
 for(let priority=0;priority<12;priority++){const rows=[{id:'start',arrival:0,duration:5,priority:99},{id:'old',arrival:1,duration:1,priority},{id:'new',arrival:4,duration:1,priority:5}];check(rows,oracle(rows));}
};
