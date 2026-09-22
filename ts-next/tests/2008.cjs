'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const xs=Object.freeze([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]);assert.deepEqual(solve(xs),[11,12,13,14,15,16,17,18]);assert.deepEqual(solve([]),[]);assert.deepEqual(solve([1]),[]);const obj={};const out=solve([...Array(10).fill(0),obj]);assert.equal(out[0],obj);
};
