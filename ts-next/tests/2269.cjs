'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"name":"Ada"};const out=solve(input);assert.deepEqual(Object.keys(out),["getName"]);assert.equal(out.getName(),input.name);assert.notEqual(out,solve(input));input.name="Ada";assert.equal(out.getName(),input.name);
};
