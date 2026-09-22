'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({}),{"name":"Ada","active":true,"tags":["a","b"]});const supplied=Object.freeze({"name":"Ada","active":true,"tags":["a","b"]});const r=solve(supplied);assert.deepEqual(r,supplied);assert.notEqual(r,supplied);assert.deepEqual(solve({name:"Ada"}),{"name":"Ada","active":true,"tags":["a","b"]});
};
