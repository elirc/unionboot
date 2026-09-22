'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
const input=[2,-1,4,7]; const q=solve(input); assert.equal(q(1,3),3);
assert.equal(q(0,4),12); assert.equal(q(2,2),0);
input[0]=999; assert.equal(q(0,1),2);
assert.throws(()=>q(3,2),RangeError); assert.throws(()=>q(0,5),RangeError);
assert.equal(solve([])(0,0),0);
};
