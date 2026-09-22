'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(...["item0",2]),"item0 | 2");assert.equal(solve(...["",0])," | 0");assert.equal(solve(...["item0",2]),solve(...["item0",2]));
};
