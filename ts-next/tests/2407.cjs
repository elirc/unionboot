'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({active:true}),"active=true");assert.throws(()=>solve({}),/Choose exactly one/);const input=Object.freeze({active:true});assert.equal(solve(input),"active=true");
};
