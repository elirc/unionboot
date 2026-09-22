'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"name":"Ada","active":true,"tags":["a","b"]};const out=solve(input);assert.deepEqual(input,{"name":"Ada","active":true,"tags":["a","b"]});assert.deepEqual(Object.keys(out),["setName","setActive","setTags"]);assert.equal(out.setName("Ada"),undefined);assert.deepEqual(input.name,"Ada");assert.equal(out.setActive(true),undefined);assert.deepEqual(input.active,true);assert.equal(out.setTags(["a","b"]),undefined);assert.deepEqual(input.tags,["a","b"]);assert.notEqual(out,solve(input));
};
