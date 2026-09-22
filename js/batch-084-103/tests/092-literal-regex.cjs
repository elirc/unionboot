'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
const text='a.b+[x](y)?'; assert.ok(new RegExp('^'+solve(text)+'$').test(text));
assert.ok(!new RegExp('^'+solve('a.b')+'$').test('axb'));
assert.equal(solve('hello'),'hello'); assert.equal(solve(''),'');
const slash=String.fromCharCode(92); assert.ok(new RegExp('^'+solve(slash)+'$').test(slash));
};
