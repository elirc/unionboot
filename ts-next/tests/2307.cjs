'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"name":"Ada","tags":["a","b"]});assert.deepEqual(solve(input),input);assert.notEqual(solve(input),input);const nulled={"name":null,"tags":null};assert.deepEqual(solve(nulled),{});assert.equal(Object.hasOwn(solve({...input,name:null}),"name"),false);
};
