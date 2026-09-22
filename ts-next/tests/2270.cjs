'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"count":3};const out=solve(input);assert.deepEqual(Object.keys(out),["getCount"]);assert.equal(out.getCount(),input.count);assert.notEqual(out,solve(input));input.count=3;assert.equal(out.getCount(),input.count);
};
