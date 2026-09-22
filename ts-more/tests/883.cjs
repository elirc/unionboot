'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([null,...[1,100,1000],undefined]); assert.deepEqual(solve(xs),[1,100,1000]); assert.deepEqual(solve([0,false,'',null,undefined,NaN]),[0,false,'',NaN]); assert.deepEqual(solve([null,undefined]),[]); assert.deepEqual(solve([]),[]); const obj={}; assert.equal(solve([null,obj])[0],obj);
};
