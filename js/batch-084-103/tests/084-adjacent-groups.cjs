'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.deepEqual(solve([1,1,2,1]), [[1,1],[2],[1]]);
assert.deepEqual(solve([]), []);
assert.deepEqual(solve([NaN,NaN,0,-0]), [[NaN,NaN],[0],[-0]]);
const input = Object.freeze(['a','a','b']); assert.deepEqual(solve(input), [['a','a'],['b']]);
};
