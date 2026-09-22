'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("11111111"),255);assert.equal(solve("00000000"),0);assert.equal(solve("00000001"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("111111110"),/Invalid binary word/);
};
