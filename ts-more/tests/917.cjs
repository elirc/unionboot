'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([10000,20000,30000]); const i=xs.findIndex(x=>x>0); assert.deepEqual(solve(xs,x=>x>0),i<0?{found:false}:{found:true,value:xs[i],index:i}); assert.deepEqual(solve([],()=>true),{found:false}); assert.deepEqual(solve([undefined],()=>true),{found:true,value:undefined,index:0}); let calls=0; solve([1,2,3],()=>{calls++;return true;}); assert.equal(calls,1); assert.deepEqual(solve([1],()=>false),{found:false});
};
