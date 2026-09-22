'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve(0),[0,0,0,0]);const obj={x:1};const out=solve(obj);assert.equal(out.length,4);assert.ok(out.every(x=>x===obj));assert.deepEqual(solve(undefined),Array(4).fill(undefined));assert.notEqual(solve(1),solve(1));
};
