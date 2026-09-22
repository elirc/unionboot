'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("1111111111"),1023);assert.equal(solve("0000000000"),0);assert.equal(solve("0000000001"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("11111111110"),/Invalid binary word/);
};
