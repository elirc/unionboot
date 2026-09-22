'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve(Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17])),[[1,2,3,4,5,6,7,8],[2,3,4,5,6,7,8,9],[3,4,5,6,7,8,9,10],[4,5,6,7,8,9,10,11],[5,6,7,8,9,10,11,12],[6,7,8,9,10,11,12,13],[7,8,9,10,11,12,13,14],[8,9,10,11,12,13,14,15],[9,10,11,12,13,14,15,16],[10,11,12,13,14,15,16,17]]);assert.deepEqual(solve([]),[]);assert.deepEqual(solve(Array(7).fill(1)),[]);const obj={};const input=Array(8).fill(obj);const out=solve(input);assert.equal(out.length,1);assert.equal(out[0][0],obj);assert.notEqual(out[0],input);
};
