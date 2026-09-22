'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.equal(solve('/a//b/../c/.'),'/a/c');
assert.equal(solve('/../../'),'/'); assert.equal(solve('/a/'),'/a');
assert.throws(()=>solve('a/b'),TypeError); assert.equal(solve('/a/%2e%2e'),'/a/%2e%2e');
};
