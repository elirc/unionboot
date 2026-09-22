'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]);assert.deepEqual(solve(input),[9,10,11,12,13,14,15,16,17,1,2,3,4,5,6,7,8]);assert.deepEqual(solve([]),[]);assert.deepEqual(solve([9]),[9]);const a={};assert.equal(solve([a])[0],a);
};
