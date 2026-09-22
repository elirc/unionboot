'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({}),{"name":"Ada"});const supplied=Object.freeze({"name":"Ada"});const r=solve(supplied);assert.deepEqual(r,supplied);assert.notEqual(r,supplied);assert.deepEqual(solve({name:"Ada"}),{"name":"Ada"});
};
