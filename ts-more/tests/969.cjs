'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
for(const x of [0,1,0,-1]) assert.deepEqual(solve(x),{ok:true,value:x}); for(const x of ['1',null,undefined,{},[],true,new Number(1)]) assert.deepEqual(solve(x),{ok:false,error:'not-number'}); for(const x of [NaN,Infinity,-Infinity]) assert.deepEqual(solve(x),{ok:false,error:'not-finite'}); assert.ok(Object.is(solve(-0).value,-0)); assert.deepEqual(solve(0),{ok:true,value:0});
};
