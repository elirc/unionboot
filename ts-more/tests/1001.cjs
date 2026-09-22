'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve(["-2","4","-6","8"]),true); assert.equal(solve(Object.freeze(['a',''])),true); assert.equal(solve([]),true); for(const x of [null,'abc',{},[1],['a',undefined],new Array(2)]) assert.equal(solve(x),false); assert.equal(solve(['a',new String('x')]),false);
};
