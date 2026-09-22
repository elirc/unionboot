'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.equal(solve(255n,16),'ff');assert.equal(solve(10n,2),'1010');assert.equal(solve(0n,36),'0');
assert.equal(solve(35n,36),'z');assert.throws(()=>solve(2n,1),RangeError);
assert.throws(()=>solve(-1n,10),RangeError);
};
