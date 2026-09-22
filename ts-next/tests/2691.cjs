'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(Object.freeze([1,2,3]),Object.freeze([1,2,3])),14);assert.equal(solve([1,2,3],[0,0,0]),0);assert.equal(solve([1,2,3],[-1,-1,-1]),-6);assert.equal(solve([0.5,0.5,0.5],[2,2,2]),3);
};
