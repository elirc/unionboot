'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze([1,"v1",true,4,"v4"]);assert.deepEqual(solve(input),["v4",4,true,"v1",1]);assert.deepEqual(input,[1,"v1",true,4,"v4"]);assert.notEqual(solve(input),input);const alternate=input.map(x=>typeof x==='number'?-x:typeof x==='string'?'':!x);assert.deepEqual(solve(alternate),[...alternate].reverse());
};
