'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"count":3};const out=solve(input);assert.deepEqual(input,{"count":3});assert.deepEqual(Object.keys(out),["setCount"]);assert.equal(out.setCount(3),undefined);assert.deepEqual(input.count,3);assert.notEqual(out,solve(input));
};
