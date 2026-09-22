'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"count":3,"active":true};const out=solve(input);assert.deepEqual(input,{"count":3,"active":true});assert.deepEqual(Object.keys(out),["setCount","setActive"]);assert.equal(out.setCount(3),undefined);assert.deepEqual(input.count,3);assert.equal(out.setActive(true),undefined);assert.deepEqual(input.active,true);assert.notEqual(out,solve(input));
};
