'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.deepEqual(solve([1,2,3,4,5],2,6),[[1,5],[2,4]]);
assert.deepEqual(solve([5,-4,2],2,1),[[5,-4]]);
assert.deepEqual(solve([],0,0),[[]]);assert.deepEqual(solve([1],2,1),[]);
assert.deepEqual(solve([1,2],0,3),[]);
};
