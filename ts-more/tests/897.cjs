'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([...[-9,9,-9,9],'label',null]); assert.deepEqual(solve(xs,x=>typeof x==='number'),[-9,9,-9,9]); assert.deepEqual(solve(xs,x=>typeof x==='string'),['label']); assert.deepEqual(solve([],()=>false),[]); const row={kind:'yes',value:1}; assert.equal(solve([row,{kind:'no'}],x=>x.kind==='yes')[0],row);
};
