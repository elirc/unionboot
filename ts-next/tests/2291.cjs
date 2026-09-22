'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"tags":["a","b"]};const out=solve(input);assert.deepEqual(input,{"tags":["a","b"]});assert.deepEqual(Object.keys(out),["setTags"]);assert.equal(out.setTags(["a","b"]),undefined);assert.deepEqual(input.tags,["a","b"]);assert.notEqual(out,solve(input));
};
