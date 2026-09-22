'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(await solve(()=>7),{ok:true,value:7});assert.deepEqual(await solve(()=>Promise.resolve('x')),{ok:true,value:'x'});const error={code:2};assert.equal((await solve(()=>{throw error;})).error,error);assert.deepEqual(await solve(()=>Promise.reject('offline')),{ok:false,error:'offline'});let calls=0;await solve(()=>{calls++;return undefined;});assert.equal(calls,1);assert.deepEqual(await solve(()=>null),{ok:true,value:null});
};
