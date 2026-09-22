'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"name":"Ada","count":3,"active":true,"tags":["a","b"]});const out=solve(input);assert.deepEqual(out,input);assert.notEqual(out,input);assert.equal(out.tags,input.tags);assert.ok(!Object.isFrozen(out));out.active=true;assert.deepEqual(input,{"name":"Ada","count":3,"active":true,"tags":["a","b"]});
};
