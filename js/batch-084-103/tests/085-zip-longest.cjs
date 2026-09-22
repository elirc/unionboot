'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.deepEqual(solve([1,2],['a']), [[1,'a'],[2,null]]);
assert.deepEqual(solve([],[],0), []);
assert.deepEqual(solve([undefined],[2,3],'?'), [[undefined,2],['?',3]]);
assert.deepEqual(solve([],['x'],false), [[false,'x']]);
};
