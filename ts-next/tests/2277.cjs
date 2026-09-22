'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"name":"Ada","tags":["a","b"]};const out=solve(input);assert.deepEqual(Object.keys(out),["getName","getTags"]);assert.equal(out.getName(),input.name);assert.equal(out.getTags(),input.tags);assert.notEqual(out,solve(input));input.name="Ada";assert.equal(out.getName(),input.name);
};
