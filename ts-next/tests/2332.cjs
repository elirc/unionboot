'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"active":true});const out=solve(input);assert.deepEqual(out,[["active",true]]);assert.notEqual(out,solve(input));assert.equal(out[0][1],input.active);assert.deepEqual(input,{"active":true});
};
