'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.deepEqual(solve([[1,2,3],[4,5,6]]),[[1,4],[2,5],[3,6]]);
assert.deepEqual(solve([]),[]);assert.deepEqual(solve([[],[]]),[]);
assert.throws(()=>solve([[1],[2,3]]),RangeError);
const item={};assert.equal(solve([[item]])[0][0],item);
};
