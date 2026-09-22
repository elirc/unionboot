'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(Object.freeze([1,2,3,4]),Object.freeze([1,2,3,4])),30);assert.equal(solve([1,2,3,4],[0,0,0,0]),0);assert.equal(solve([1,2,3,4],[-1,-1,-1,-1]),-10);assert.equal(solve([0.5,0.5,0.5,0.5],[2,2,2,2]),4);
};
