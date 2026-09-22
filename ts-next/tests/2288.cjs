'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"name":"Ada","active":true};const out=solve(input);assert.deepEqual(input,{"name":"Ada","active":true});assert.deepEqual(Object.keys(out),["setName","setActive"]);assert.equal(out.setName("Ada"),undefined);assert.deepEqual(input.name,"Ada");assert.equal(out.setActive(true),undefined);assert.deepEqual(input.active,true);assert.notEqual(out,solve(input));
};
