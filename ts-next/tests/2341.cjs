'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"name":"Ada","active":true,"tags":["a","b"]});const out=solve(input);assert.deepEqual(out,[["name","Ada"],["active",true],["tags",["a","b"]]]);assert.notEqual(out,solve(input));assert.equal(out[0][1],input.name);assert.deepEqual(input,{"name":"Ada","active":true,"tags":["a","b"]});
};
