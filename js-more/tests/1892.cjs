// 1892 Injected token-bucket limiter / scenario 4 — capacity=3; refill=1
// Prompt: ../prompts/1892.txt
'use strict';
const assert=require('node:assert/strict');
const cfg={"capacity":3,"refill":1};
module.exports=async solve=>{
const eq=assert.equal,deep=assert.deepEqual;
function check(input,expected){const before=structuredClone(input);deep(solve(input),expected);deep(input,before,'Input must not mutate');}
let time=0;const bucket=solve({now:()=>time});deep(bucket.take(cfg.capacity),{allowed:true,tokens:0});deep(bucket.take(),{allowed:false,tokens:0});time=1;deep(bucket.take(0.5),{allowed:true,tokens:cfg.refill-0.5});time=100;deep(bucket.take(1),{allowed:true,tokens:cfg.capacity-1});deep(bucket.take(cfg.capacity+1),{allowed:false,tokens:cfg.capacity-1});assert.throws(()=>bucket.take(0),/Invalid cost/);time=99;assert.throws(()=>bucket.take(),/Time reversed/);let t=0;const other=solve({now:()=>t});deep(other.take(),{allowed:true,tokens:cfg.capacity-1});
};
