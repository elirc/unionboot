'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(13,99),13);assert.equal(solve(null,99),99);assert.equal(solve(undefined,99),99);assert.equal(solve(0,99),0);assert.equal(solve(false,true),false);assert.equal(solve('','fallback'),'');assert.ok(Number.isNaN(solve(NaN,1)));const obj={};assert.equal(solve(null,obj),obj);
};
