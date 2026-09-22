'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"name":"Ada"};const out=solve(input);assert.deepEqual(input,{"name":"Ada"});assert.deepEqual(Object.keys(out),["setName"]);assert.equal(out.setName("Ada"),undefined);assert.deepEqual(input.name,"Ada");assert.notEqual(out,solve(input));
};
