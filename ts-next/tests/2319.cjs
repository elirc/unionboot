'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({}),{"count":3,"active":true});const supplied=Object.freeze({"count":3,"active":true});const r=solve(supplied);assert.deepEqual(r,supplied);assert.notEqual(r,supplied);assert.deepEqual(solve({count:3}),{"count":3,"active":true});
};
