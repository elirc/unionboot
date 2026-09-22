'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"name":"Ada","count":3});const out=solve(input);assert.deepEqual(out,[["name","Ada"],["count",3]]);assert.notEqual(out,solve(input));assert.equal(out[0][1],input.name);assert.deepEqual(input,{"name":"Ada","count":3});
};
