'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve([],0),[0,0,0,0,0,0,0,0,0,0,0,0,0,0]);const input=Object.freeze([1]);assert.deepEqual(solve(input,2),[1,2,2,2,2,2,2,2,2,2,2,2,2,2]);const long=Array(17).fill(8);assert.deepEqual(solve(long,0),long);const obj={};assert.equal(solve([],obj)[0],obj);
};
