'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({name:"Ada"}),"name=\"Ada\"");assert.equal(solve({count:3}),"count=3");assert.throws(()=>solve({}),/Choose exactly one/);assert.throws(()=>solve({"name":"Ada","count":3}),/Choose exactly one/);const input=Object.freeze({name:"Ada"});assert.equal(solve(input),"name=\"Ada\"");
};
