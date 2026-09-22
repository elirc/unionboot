'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve(Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]),'insert'),[1,2,3,4,5,6,"insert",7,8,9,10,11,12,13,14,15,16,17]);assert.deepEqual(solve([],1),[1]);assert.deepEqual(solve([1],2),[1,2]);const obj={};assert.equal(solve([],obj)[0],obj);
};
