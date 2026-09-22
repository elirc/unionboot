'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze([1,2,3,4]); const out=solve(input); assert.deepEqual(out,[{"index":0,"value":1},{"index":1,"value":2},{"index":2,"value":3},{"index":3,"value":4}]); assert.deepEqual(input,[1,2,3,4]); assert.notEqual(out,input); assert.notEqual(out[0],solve(input)[0]);
};
