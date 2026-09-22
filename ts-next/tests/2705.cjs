'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2,3]);assert.deepEqual(solve(cs,1),{degree:2,value:6});assert.deepEqual(solve(cs,0),{degree:2,value:3});assert.deepEqual(solve(Array(3).fill(0),2),{degree:2,value:0});assert.equal(solve(cs,-1).value,2);assert.deepEqual(cs,[1,2,3]);
};
