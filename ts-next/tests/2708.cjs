'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2,3,4,5,6]);assert.deepEqual(solve(cs,1),{degree:5,value:21});assert.deepEqual(solve(cs,0),{degree:5,value:6});assert.deepEqual(solve(Array(6).fill(0),2),{degree:5,value:0});assert.equal(solve(cs,-1).value,3);assert.deepEqual(cs,[1,2,3,4,5,6]);
};
