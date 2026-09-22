'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
const graph=new Map([['a',['b','c','b']],['b',['d']],['c',['d','a']]]);
assert.deepEqual(solve(graph,'a'),['a','b','c','d']);
assert.deepEqual(solve(graph,'z'),['z']);
assert.deepEqual(solve(new Map([['x',['x']]]),'x'),['x']);
assert.deepEqual(graph.get('a'),['b','c','b']);
};
