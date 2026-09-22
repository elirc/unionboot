'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve(Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18])),[1,2,3,4,5,6,7,8,9]); assert.deepEqual(solve([]),[]); const a={};assert.equal(solve([a])[0],a);assert.deepEqual(solve([1]),[1]);
};
