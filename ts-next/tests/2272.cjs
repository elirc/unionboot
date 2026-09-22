'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"active":true};const out=solve(input);assert.deepEqual(Object.keys(out),["getActive"]);assert.equal(out.getActive(),input.active);assert.notEqual(out,solve(input));input.active=true;assert.equal(out.getActive(),input.active);
};
