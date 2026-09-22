'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze([1,"v1",true]);assert.deepEqual(solve(input),[true,"v1",1]);assert.deepEqual(input,[1,"v1",true]);assert.notEqual(solve(input),input);const alternate=input.map(x=>typeof x==='number'?-x:typeof x==='string'?'':!x);assert.deepEqual(solve(alternate),[...alternate].reverse());
};
