'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=[-8,-3,-1]; assert.deepEqual(solve({ok:true,value:xs},a=>a.length),{ok:true,value:xs.length}); const fail=Object.freeze({ok:false,error:{code:'offline'}}); let calls=0; assert.equal(solve(fail,()=>{calls++;}),fail); assert.equal(calls,0); assert.deepEqual(solve({ok:true,value:0},String),{ok:true,value:'0'}); assert.throws(()=>solve({ok:true,value:1},()=>{throw Error('mapper');}),/mapper/);
};
