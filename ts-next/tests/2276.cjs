'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"tags":["a","b"]};const out=solve(input);assert.deepEqual(Object.keys(out),["getTags"]);assert.equal(out.getTags(),input.tags);assert.notEqual(out,solve(input));input.tags=["a","b"];assert.equal(out.getTags(),input.tags);
};
