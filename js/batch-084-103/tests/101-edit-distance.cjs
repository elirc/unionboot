'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.equal(solve('kitten','sitting'),3);assert.equal(solve('','abc'),3);
assert.equal(solve('same','same'),0);assert.equal(solve('ab','ba'),2);assert.equal(solve('abc',''),3);
};
