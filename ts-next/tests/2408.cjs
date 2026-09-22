'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({name:"Ada"}),"name=\"Ada\"");assert.equal(solve({active:true}),"active=true");assert.throws(()=>solve({}),/Choose exactly one/);assert.throws(()=>solve({"name":"Ada","active":true}),/Choose exactly one/);const input=Object.freeze({name:"Ada"});assert.equal(solve(input),"name=\"Ada\"");
};
