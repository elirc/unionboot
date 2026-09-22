'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.equal(solve([10,9,2,5,3,7,101,18]),4);
assert.equal(solve([2,2,2]),1);assert.equal(solve([]),0);assert.equal(solve([5,4,3]),1);
assert.equal(solve([-3,-2,-1]),3);
};
