'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2]);assert.deepEqual(solve(cs,1),{degree:1,value:3});assert.deepEqual(solve(cs,0),{degree:1,value:2});assert.deepEqual(solve(Array(2).fill(0),2),{degree:1,value:0});assert.equal(solve(cs,-1).value,1);assert.deepEqual(cs,[1,2]);
};
