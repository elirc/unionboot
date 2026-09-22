'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"name":"Ada","active":true};const out=solve(input);assert.deepEqual(Object.keys(out),["getName","getActive"]);assert.equal(out.getName(),input.name);assert.equal(out.getActive(),input.active);assert.notEqual(out,solve(input));input.name="Ada";assert.equal(out.getName(),input.name);
};
