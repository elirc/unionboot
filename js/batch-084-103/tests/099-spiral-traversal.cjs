'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.deepEqual(solve([[1,2,3],[4,5,6],[7,8,9]]),[1,2,3,6,9,8,7,4,5]);
assert.deepEqual(solve([[1,2,3]]),[1,2,3]);assert.deepEqual(solve([[1],[2],[3]]),[1,2,3]);
assert.deepEqual(solve([]),[]);assert.deepEqual(solve([[]]),[]);
};
