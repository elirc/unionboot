'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({tags:["a","b"]}),"tags=[\"a\",\"b\"]");assert.throws(()=>solve({}),/Choose exactly one/);const input=Object.freeze({tags:["a","b"]});assert.equal(solve(input),"tags=[\"a\",\"b\"]");
};
