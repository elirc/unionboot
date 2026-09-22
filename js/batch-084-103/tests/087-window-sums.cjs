'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.deepEqual(solve([1,2,3,4],2), [3,5,7]);
assert.deepEqual(solve([-2,3,-1],1), [-2,3,-1]);
assert.deepEqual(solve([1],2), []);
assert.throws(()=>solve([],0),RangeError);
assert.throws(()=>solve([1],1.5),RangeError);
};
