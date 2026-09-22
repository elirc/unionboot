'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({ok:true,value:11},n=>({ok:true,value:String(n)})),{ok:true,value:'11'});assert.deepEqual(solve({ok:true,value:0},()=>({ok:false,error:'empty'})),{ok:false,error:'empty'});const fail={ok:false,error:{code:1}};let calls=0;assert.equal(solve(fail,()=>{calls++;}),fail);assert.equal(calls,0);const out={ok:true,value:null};assert.equal(solve({ok:true,value:1},()=>out),out);assert.throws(()=>solve({ok:true,value:1},()=>{throw Error('next');}),/next/);
};
