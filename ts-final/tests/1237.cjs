'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([2,2,3,2]);let active=0,max=0;const seen=[];const out=await solve(xs,async(x,i)=>{active++;max=Math.max(max,active);seen.push(i);await Promise.resolve();active--;return String(x);});assert.deepEqual(out,xs.map(String));assert.deepEqual(seen,xs.map((_,i)=>i));assert.ok(max<=1);assert.deepEqual(await solve([],x=>x),[]);const visits=[];await assert.rejects(()=>solve([1,2,3],async x=>{visits.push(x);if(x===2)throw Error('stop');return x;}),/stop/);assert.deepEqual(visits,[1,2]);assert.deepEqual(await solve(['a'],x=>x.length),[1]);
};
