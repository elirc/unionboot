'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({}),{"active":true,"tags":["a","b"]});const supplied=Object.freeze({"active":true,"tags":["a","b"]});const r=solve(supplied);assert.deepEqual(r,supplied);assert.notEqual(r,supplied);assert.deepEqual(solve({active:true}),{"active":true,"tags":["a","b"]});
};
