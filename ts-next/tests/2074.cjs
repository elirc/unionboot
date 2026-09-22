'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze([1]); const out=solve(input); assert.deepEqual(out,[{"index":0,"value":1}]); assert.deepEqual(input,[1]); assert.notEqual(out,input); assert.notEqual(out[0],solve(input)[0]);
};
