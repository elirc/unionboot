'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({"name":"Ada","count":3,"active":true,"tags":["a","b"]});assert.deepEqual(solve(input),input);assert.notEqual(solve(input),input);assert.deepEqual(solve({...input,extra:1}),input);assert.throws(()=>solve({}),/Invalid/);assert.throws(()=>solve(null),/Invalid/);assert.throws(()=>solve(Object.create(input)),/Invalid/);assert.throws(()=>solve({...input,name:null}),/Invalid/);
};
