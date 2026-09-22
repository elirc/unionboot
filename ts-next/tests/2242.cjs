'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("1111"),15);assert.equal(solve("0000"),0);assert.equal(solve("0001"),1);assert.throws(()=>solve('2'),/Invalid binary word/);assert.throws(()=>solve("11110"),/Invalid binary word/);
};
