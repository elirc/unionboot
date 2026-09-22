'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"count":3,"active":true,"tags":["a","b"]};const out=solve(input);assert.deepEqual(Object.keys(out),["getCount","getActive","getTags"]);assert.equal(out.getCount(),input.count);assert.equal(out.getActive(),input.active);assert.equal(out.getTags(),input.tags);assert.notEqual(out,solve(input));input.count=3;assert.equal(out.getCount(),input.count);
};
