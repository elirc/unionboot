'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(...["item0",2,true]),"item0 | 2 | true");assert.equal(solve(...["",0,false])," | 0 | false");assert.equal(solve(...["item0",2,true]),solve(...["item0",2,true]));
};
