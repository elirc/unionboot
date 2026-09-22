'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={...{"name":"Ada","count":3,"active":true},extra:{id:1}};const out=solve(input);assert.notEqual(out,input);assert.equal(out.extra,input.extra);assert.equal(out.auditName(),"name=\"Ada\"");assert.equal(Object.hasOwn(input,"auditName"),false);assert.equal(out.auditCount(),"count=3");assert.equal(Object.hasOwn(input,"auditCount"),false);assert.equal(out.auditActive(),"active=true");assert.equal(Object.hasOwn(input,"auditActive"),false);assert.notEqual(out,solve(input));
};
