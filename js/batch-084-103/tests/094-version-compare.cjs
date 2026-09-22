'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.equal(solve('1.02.0','1.2'),0);
assert.equal(solve('2.0','1.99'),1); assert.equal(solve('1.2','1.2.1'),-1);
assert.equal(solve('9007199254740993','9007199254740992'),1);
assert.throws(()=>solve('1..2','1'),TypeError);
};
