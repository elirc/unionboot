'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(3,4),12);assert.equal(solve(0,5),0);assert.equal(solve(-2,3),-6);assert.equal(solve(0.5,4),2);
};
