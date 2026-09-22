'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const format=solve();assert.equal(format(7),'7');assert.equal(format(0),'0');const input=Object.freeze([1,2,3,4,5,6,7,8,9]);assert.deepEqual(format(input),["1","2","3","4","5","6","7","8","9"]);assert.notEqual(format(input),input);assert.equal(format(-2),'-2');
};
