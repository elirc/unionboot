'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const cs=Object.freeze([1,2,3,4,5,6,7,8,9,10]);assert.deepEqual(solve(cs,1),{degree:9,value:55});assert.deepEqual(solve(cs,0),{degree:9,value:10});assert.deepEqual(solve(Array(10).fill(0),2),{degree:9,value:0});assert.equal(solve(cs,-1).value,5);assert.deepEqual(cs,[1,2,3,4,5,6,7,8,9,10]);
};
