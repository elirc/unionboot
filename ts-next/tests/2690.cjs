'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(Object.freeze([1,2]),Object.freeze([1,2])),5);assert.equal(solve([1,2],[0,0]),0);assert.equal(solve([1,2],[-1,-1]),-3);assert.equal(solve([0.5,0.5],[2,2]),2);
};
