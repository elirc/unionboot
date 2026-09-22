'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({}),{"next":{"leaf":7}});const supplied={"next":{"leaf":99}};assert.deepEqual(solve(supplied),supplied);assert.equal(solve(supplied).next,supplied.next);const out=solve({});assert.notEqual(out,solve({}));assert.deepEqual(supplied,{"next":{"leaf":99}});
};
