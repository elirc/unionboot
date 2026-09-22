'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"active":true,"tags":["a","b"]};const out=solve(input);assert.deepEqual(Object.keys(out),["getActive","getTags"]);assert.equal(out.getActive(),input.active);assert.equal(out.getTags(),input.tags);assert.notEqual(out,solve(input));input.active=true;assert.equal(out.getActive(),input.active);
};
