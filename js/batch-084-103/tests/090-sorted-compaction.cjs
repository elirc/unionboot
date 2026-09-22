'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
const a=[1,1,2,2,2,5]; assert.equal(solve(a),3); assert.deepEqual(a,[1,2,5]);
const b=[]; assert.equal(solve(b),0); assert.deepEqual(b,[]);
const c=[-3,-3,-1]; assert.equal(solve(c),2); assert.deepEqual(c,[-3,-1]);
};
