// 1904 Bloom membership bitsets / scenario 6 — bits=17; hashes=3
// Prompt: ../prompts/1904.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"bits":17,"hashes":3};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
function oracle(ops){const set=new Set(),answers=[];const indexes=s=>{const codes=[...s].map(x=>x.charCodeAt(0));const a=codes.reduce((h,x)=>(h*31+x)%cfg.bits,0),b=codes.reduce((h,x)=>(h*17+x+1)%cfg.bits,0);return Array.from({length:cfg.hashes},(_,i)=>(a+i*(b||1))%cfg.bits);};for(const op of ops){const p=indexes(op.value);if(op.type==='add')p.forEach(x=>set.add(x));else answers.push(p.every(x=>set.has(x)));}return {answers,bits:Array.from({length:cfg.bits},(_,i)=>set.has(i)?'1':'0').join('')};}check([],{answers:[],bits:'0'.repeat(cfg.bits)});const ops=[{type:'has',value:'a'},{type:'add',value:'a'},{type:'has',value:'a'},{type:'add',value:''},{type:'has',value:''},...['b','aa','ab','z','__proto__'].map(value=>({type:'has',value}))];check(ops,oracle(ops));assert.throws(()=>solve([{type:'bad',value:'a'}]),/Unknown operation/);
};
