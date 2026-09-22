'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({}),{"tags":["a","b"]});const supplied=Object.freeze({"tags":["a","b"]});const r=solve(supplied);assert.deepEqual(r,supplied);assert.notEqual(r,supplied);assert.deepEqual(solve({tags:["a","b"]}),{"tags":["a","b"]});
};
