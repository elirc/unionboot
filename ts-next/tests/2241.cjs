'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("111"),7);assert.equal(solve("000"),0);assert.equal(solve("001"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("1110"),/Invalid binary word/);
};
