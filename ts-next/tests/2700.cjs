'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12]),Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12])),650);assert.equal(solve([1,2,3,4,5,6,7,8,9,10,11,12],[0,0,0,0,0,0,0,0,0,0,0,0]),0);assert.equal(solve([1,2,3,4,5,6,7,8,9,10,11,12],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]),-78);assert.equal(solve([0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5,0.5],[2,2,2,2,2,2,2,2,2,2,2,2]),12);
};
