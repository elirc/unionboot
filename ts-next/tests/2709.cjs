'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2,3,4,5,6,7]);assert.deepEqual(solve(cs,1),{degree:6,value:28});assert.deepEqual(solve(cs,0),{degree:6,value:7});assert.deepEqual(solve(Array(7).fill(0),2),{degree:6,value:0});assert.equal(solve(cs,-1).value,4);assert.deepEqual(cs,[1,2,3,4,5,6,7]);
};
