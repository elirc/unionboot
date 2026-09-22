'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(Object.freeze([1,2,3,4,5]),Object.freeze([1,2,3,4,5])),55);assert.equal(solve([1,2,3,4,5],[0,0,0,0,0]),0);assert.equal(solve([1,2,3,4,5],[-1,-1,-1,-1,-1]),-15);assert.equal(solve([0.5,0.5,0.5,0.5,0.5],[2,2,2,2,2]),5);
};
