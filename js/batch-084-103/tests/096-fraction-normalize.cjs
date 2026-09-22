'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.deepEqual(solve(8n,12n),[2n,3n]);
assert.deepEqual(solve(2n,-6n),[-1n,3n]);assert.deepEqual(solve(0n,-5n),[0n,1n]);
assert.throws(()=>solve(1n,0n),RangeError);assert.deepEqual(solve(-9n,-3n),[3n,1n]);
};
