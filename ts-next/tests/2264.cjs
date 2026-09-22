'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve('x'),"[[[[[[[[[[[x]]]]]]]]]]]");assert.equal(solve(''),"[[[[[[[[[[[]]]]]]]]]]]");assert.equal(solve(']['),"[[[[[[[[[[[][]]]]]]]]]]]");assert.equal(solve("\n"),"[[[[[[[[[[[\n]]]]]]]]]]]");
};
