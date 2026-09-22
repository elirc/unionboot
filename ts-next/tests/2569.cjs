'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={...{"name":"Ada"},extra:{id:1}};const out=solve(input);assert.notEqual(out,input);assert.equal(out.extra,input.extra);assert.equal(out.auditName(),"name=\"Ada\"");assert.equal(Object.hasOwn(input,"auditName"),false);assert.notEqual(out,solve(input));
};
