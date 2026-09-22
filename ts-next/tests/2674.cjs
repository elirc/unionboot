'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({"name1":"N1"}),"Hello N1! N1");const alt={...{"name1":"N1"},name1:'{name1}'};assert.equal(solve(alt),"Hello {name1}! {name1}");assert.equal(solve({...{"name1":"N1"},name1:''}).endsWith('! '),true);
};
