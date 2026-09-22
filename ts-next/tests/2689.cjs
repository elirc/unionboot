'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(Object.freeze([1]),Object.freeze([1])),1);assert.equal(solve([1],[0]),0);assert.equal(solve([1],[-1]),-1);assert.equal(solve([0.5],[2]),1);
};
