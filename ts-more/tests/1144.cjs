'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
let calls=[];const f=solve(x=>{calls.push('first');return x+0;},n=>{calls.push('second');return String(n);});assert.deepEqual(calls,[]);assert.equal(f(2),'2');assert.deepEqual(calls,['first','second']);assert.equal(f(0),'0');assert.throws(()=>solve(()=>{throw Error('first');},()=>{throw Error('second');})(0),/first/);assert.equal(solve(x=>x.length,n=>n>0)(''),false);
};
