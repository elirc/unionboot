'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const attempts=[];assert.deepEqual(await solve(i=>{attempts.push(i);if(i<15)throw 'later';return 7;}),{ok:true,value:7,attempt:15});assert.deepEqual(attempts,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]);const reason={offline:true};assert.deepEqual(await solve(()=>Promise.reject(reason)),{ok:false,error:reason,attempts:15});let calls=0;assert.deepEqual(await solve(()=>{calls++;return false;}),{ok:true,value:false,attempt:1});assert.equal(calls,1);
};
