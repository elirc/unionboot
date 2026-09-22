'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(Object.freeze([1,2,3,4,5,6]),Object.freeze([1,2,3,4,5,6])),91);assert.equal(solve([1,2,3,4,5,6],[0,0,0,0,0,0]),0);assert.equal(solve([1,2,3,4,5,6],[-1,-1,-1,-1,-1,-1]),-21);assert.equal(solve([0.5,0.5,0.5,0.5,0.5,0.5],[2,2,2,2,2,2]),6);
};
