'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([12,...[3,1,3,2,1]]);assert.equal(solve(xs,(a,b)=>a-b),Math.min(...xs));const a={score:1},b={score:1};assert.equal(solve([a,b],(x,y)=>x.score-y.score),a);assert.equal(solve(['z','a'],(a,b)=>a.localeCompare(b)),'a');let calls=0;assert.equal(solve([42],()=>{calls++;return 0;}),42);assert.equal(calls,0);
};
