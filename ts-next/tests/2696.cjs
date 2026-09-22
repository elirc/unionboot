'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(Object.freeze([1,2,3,4,5,6,7,8]),Object.freeze([1,2,3,4,5,6,7,8])),204);assert.equal(solve([1,2,3,4,5,6,7,8],[0,0,0,0,0,0,0,0]),0);assert.equal(solve([1,2,3,4,5,6,7,8],[-1,-1,-1,-1,-1,-1,-1,-1]),-36);assert.equal(solve([0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],[2,2,2,2,2,2,2,2]),8);
};
