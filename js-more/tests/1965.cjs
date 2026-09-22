// 1965 Polynomial convolution / scenario 7 — modulus=7; trim=false
// Prompt: ../prompts/1965.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"modulus":7,"trim":false};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
function oracle(a,b){if(!a.length||!b.length)return [];const out=Array.from({length:a.length+b.length-1},(_,degree)=>a.reduce((sum,x,i)=>sum+x*(b[degree-i]??0),0)).map(x=>cfg.modulus?((x%cfg.modulus)+cfg.modulus)%cfg.modulus:x);if(cfg.trim)while(out.length&&out.at(-1)===0)out.pop();return out;}for(const [a,b] of [[[],[]],[[0],[1]],[[1,2,3],[4,5]],[[1,-1],[1,1]],[[-3,4,0],[2,0]],[[-1,7,2],[5,-4,3]]])check({a,b},oracle(a,b));
};
