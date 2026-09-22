'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.deepEqual(solve([1,2,3,4],n=>n%2===0), [[2,4],[1,3]]);
assert.deepEqual(solve([],()=>true), [[],[]]);
const seen=[]; assert.deepEqual(solve(['a','b','c'],(v,i)=>{seen.push([v,i]);return i!==1;}), [['a','c'],['b']]);
assert.deepEqual(seen,[['a',0],['b',1],['c',2]]);
};
