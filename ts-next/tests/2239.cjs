'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("1"),1);assert.equal(solve("0"),0);assert.equal(solve("1"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("10"),/Invalid binary word/);
};
