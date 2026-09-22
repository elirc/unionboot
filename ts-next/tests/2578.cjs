'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={...{"count":3,"tags":["a","b"]},extra:{id:1}};const out=solve(input);assert.notEqual(out,input);assert.equal(out.extra,input.extra);assert.equal(out.auditCount(),"count=3");assert.equal(Object.hasOwn(input,"auditCount"),false);assert.equal(out.auditTags(),"tags=[\"a\",\"b\"]");assert.equal(Object.hasOwn(input,"auditTags"),false);assert.notEqual(out,solve(input));
};
