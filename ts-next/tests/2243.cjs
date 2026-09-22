'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("11111"),31);assert.equal(solve("00000"),0);assert.equal(solve("00001"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("111110"),/Invalid binary word/);
};
