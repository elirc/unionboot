'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2,3,4,5]);assert.deepEqual(solve(cs,1),{degree:4,value:15});assert.deepEqual(solve(cs,0),{degree:4,value:5});assert.deepEqual(solve(Array(5).fill(0),2),{degree:4,value:0});assert.equal(solve(cs,-1).value,3);assert.deepEqual(cs,[1,2,3,4,5]);
};
