'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"tags":["a","b"]});const out=solve(input);assert.deepEqual(out,[["tags",["a","b"]]]);assert.notEqual(out,solve(input));assert.equal(out[0][1],input.tags);assert.deepEqual(input,{"tags":["a","b"]});
};
