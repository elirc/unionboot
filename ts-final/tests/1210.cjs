'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
let calls=0;assert.equal(solve((a,b)=>{calls++;return a+b;},6,2),8);assert.equal(calls,1);assert.equal(solve(()=>42),42);assert.equal(solve((a,b=3)=>a+b,2),5);const obj={};assert.equal(solve(x=>x,obj),obj);assert.throws(()=>solve(()=>{throw Error('callback');}),/callback/);
};
