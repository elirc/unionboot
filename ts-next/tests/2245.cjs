'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("1111111"),127);assert.equal(solve("0000000"),0);assert.equal(solve("0000001"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("11111110"),/Invalid binary word/);
};
