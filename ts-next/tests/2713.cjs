'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2,3,4,5,6,7,8,9,10,11]);assert.deepEqual(solve(cs,1),{degree:10,value:66});assert.deepEqual(solve(cs,0),{degree:10,value:11});assert.deepEqual(solve(Array(11).fill(0),2),{degree:10,value:0});assert.equal(solve(cs,-1).value,6);assert.deepEqual(cs,[1,2,3,4,5,6,7,8,9,10,11]);
};
