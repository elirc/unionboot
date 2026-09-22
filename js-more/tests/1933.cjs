// 1933 Consistent-hash ring / scenario 5 — replicas=3; slots=97
// Prompt: ../prompts/1933.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"replicas":3,"slots":97};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
const hash=s=>[...s].reduce((h,c)=>(31*h+c.charCodeAt(0))%cfg.slots,0);function oracle(nodes,keys){const slots=[];for(const node of nodes)for(let replica=0;replica<cfg.replicas;replica++)slots.push({node,p:hash(node+'#'+replica),replica});slots.sort((a,b)=>a.p-b.p||(a.node<b.node?-1:a.node>b.node?1:a.replica-b.replica));return keys.map(key=>(slots.find(x=>x.p>=hash(key))||slots[0])?.node??null);}const keys=['','a','b','c','account-1','account-2','zz','__proto__',...Array.from({length:30},(_,i)=>String(i))];for(const nodes of [[],['solo'],['a','b','c'],['a','c'],['c','b','a']])check({nodes,keys},oracle(nodes,keys));
};
