'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"count":3});assert.deepEqual(solve(input),input);assert.notEqual(solve(input),input);const nulled={"count":null};assert.deepEqual(solve(nulled),{});assert.equal(Object.hasOwn(solve({...input,count:null}),"count"),false);
};
