'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);assert.deepEqual(solve(cs,1),{degree:15,value:136});assert.deepEqual(solve(cs,0),{degree:15,value:16});assert.deepEqual(solve(Array(16).fill(0),2),{degree:15,value:0});assert.equal(solve(cs,-1).value,8);assert.deepEqual(cs,[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]);
};
