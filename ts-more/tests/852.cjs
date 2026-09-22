'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([-9,9,-9,9]); let calls=0; assert.deepEqual(solve(xs,x=>{calls++;return x;}),[...new Set(xs)]); assert.equal(calls,xs.length); assert.deepEqual(solve([],x=>x),[]); const a={id:1},b={id:1}; assert.equal(solve([a,b],r=>r.id)[0],a); assert.equal(solve([a,b],r=>r).length,2); assert.deepEqual(solve([NaN,NaN,0,-0],x=>x),[NaN,0]);
};
