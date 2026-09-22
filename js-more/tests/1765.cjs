// 1765 Union-find components / scenario 7 — size=6; root=minimum
// Prompt: ../prompts/1765.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"size":6,"root":"minimum"};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
check([],{answers:[],roots:Array.from({length:cfg.size},(_,i)=>i),components:cfg.size});const ops=[{type:'same',a:0,b:1},{type:'union',a:0,b:1},{type:'union',a:2,b:1},{type:'same',a:0,b:2},{type:'union',a:cfg.size-1,b:2},{type:'same',a:cfg.size-1,b:0}];let groups=Array.from({length:cfg.size},(_,i)=>[i]),answers=[];for(const op of ops){const a=groups.find(g=>g.includes(op.a)),b=groups.find(g=>g.includes(op.b));if(op.type==='same')answers.push(a===b);else if(a!==b){groups=groups.filter(g=>g!==a&&g!==b);groups.push([...a,...b]);}}check(ops,{answers,roots:Array.from({length:cfg.size},(_,i)=>{const g=groups.find(g=>g.includes(i));return cfg.root==='minimum'?Math.min(...g):Math.max(...g);}),components:groups.length});assert.throws(()=>solve([{type:'same',a:-1,b:0}]),/Unknown node/);
};
