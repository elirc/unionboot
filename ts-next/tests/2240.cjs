'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("11"),3);assert.equal(solve("00"),0);assert.equal(solve("01"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("110"),/Invalid binary word/);
};
