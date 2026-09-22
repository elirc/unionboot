'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([2,2,3,2]); const seen=[]; const out=solve(xs,(x,i)=>{seen.push(i);return x>=0;}); assert.deepEqual(out,[xs.filter(x=>x>=0),xs.filter(x=>x<0)]); assert.deepEqual(seen,xs.map((_,i)=>i)); assert.deepEqual(solve([],()=>true),[[],[]]); const obj={id:'a'}; assert.equal(solve([obj],()=>true)[0][0],obj); assert.deepEqual(solve(['a','bb'],x=>x.length===1),[['a'],['bb']]);
};
