'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"active":true};const out=solve(input);assert.deepEqual(input,{"active":true});assert.deepEqual(Object.keys(out),["setActive"]);assert.equal(out.setActive(true),undefined);assert.deepEqual(input.active,true);assert.notEqual(out,solve(input));
};
