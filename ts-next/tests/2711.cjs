'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2,3,4,5,6,7,8,9]);assert.deepEqual(solve(cs,1),{degree:8,value:45});assert.deepEqual(solve(cs,0),{degree:8,value:9});assert.deepEqual(solve(Array(9).fill(0),2),{degree:8,value:0});assert.equal(solve(cs,-1).value,5);assert.deepEqual(cs,[1,2,3,4,5,6,7,8,9]);
};
