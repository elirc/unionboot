'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("111111111"),511);assert.equal(solve("000000000"),0);assert.equal(solve("000000001"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("1111111110"),/Invalid binary word/);
};
