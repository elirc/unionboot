'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"count":3,"active":true});const out=solve(input);assert.deepEqual(out,[["count",3],["active",true]]);assert.notEqual(out,solve(input));assert.equal(out[0][1],input.count);assert.deepEqual(input,{"count":3,"active":true});
};
