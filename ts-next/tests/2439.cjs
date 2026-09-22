'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.deepEqual(solve({}),{"next":{"next":{"next":{"next":{"next":{"next":{"leaf":7}}}}}}});const supplied={"next":{"next":{"next":{"next":{"next":{"next":{"leaf":99}}}}}}};assert.deepEqual(solve(supplied),supplied);assert.equal(solve(supplied).next.next.next.next.next.next,supplied.next.next.next.next.next.next);const out=solve({});assert.notEqual(out,solve({}));assert.deepEqual(supplied,{"next":{"next":{"next":{"next":{"next":{"next":{"leaf":99}}}}}}});
};
