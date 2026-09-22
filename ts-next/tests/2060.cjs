'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve(Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17])),[[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17]]);assert.deepEqual(solve([]),[]);assert.deepEqual(solve(Array(1).fill(1)),[]);const obj={};const input=Array(2).fill(obj);const out=solve(input);assert.equal(out.length,1);assert.equal(out[0][0],obj);assert.notEqual(out[0],input);
};
