'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([7]), size=2; const result=solve(xs,size); assert.deepEqual(result.flat(),xs); assert.ok(result.every(a=>a.length>0&&a.length<=size)); assert.equal(result.length,Math.ceil(xs.length/size)); assert.deepEqual(solve([],2),[]); for(const bad of [0,-1,1.5,NaN,Infinity]) assert.throws(()=>solve([],bad),/Invalid size/); const obj={x:1}; const out=solve([obj],1); assert.equal(out[0][0],obj); assert.deepEqual(solve(['a','b','c'],2),[['a','b'],['c']]);
};
