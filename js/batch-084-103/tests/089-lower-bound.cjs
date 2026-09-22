'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.equal(solve([1,3,3,7],3),1);
assert.equal(solve([1,3,3,7],4),3);
assert.equal(solve([],5),0);
assert.equal(solve([1,2],3),2); assert.equal(solve([1,2],-5),0);
};
