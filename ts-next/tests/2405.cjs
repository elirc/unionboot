'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({count:3}),"count=3");assert.throws(()=>solve({}),/Choose exactly one/);const input=Object.freeze({count:3});assert.equal(solve(input),"count=3");
};
