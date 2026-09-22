'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const rows=Object.freeze([2,2,3,2].map((score,i)=>Object.freeze({score,name:'n'+i}))); assert.deepEqual(solve(rows,'score'),[2,2,3,2]); assert.deepEqual(solve(rows,'name'),rows.map(r=>r.name)); assert.deepEqual(solve([],'anything'),[]); const key=Symbol('x'); assert.deepEqual(solve([{[key]:7}],key),[7]); assert.deepEqual(solve([{x:undefined},{x:2}],'x'),[undefined,2]);
};
