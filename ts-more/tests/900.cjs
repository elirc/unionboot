'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([...[1,2,3,4,5,6,7],'label',null]); assert.deepEqual(solve(xs,x=>typeof x==='number'),[1,2,3,4,5,6,7]); assert.deepEqual(solve(xs,x=>typeof x==='string'),['label']); assert.deepEqual(solve([],()=>false),[]); const row={kind:'yes',value:1}; assert.equal(solve([row,{kind:'no'}],x=>x.kind==='yes')[0],row);
};
