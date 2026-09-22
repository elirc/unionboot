'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
assert.equal(solve([['ab',2],['!',1]]),'abab!');
assert.equal(solve([['x',0]],0),''); assert.equal(solve([]),'');
assert.throws(()=>solve([['a',-1]]),TypeError);
assert.throws(()=>solve([['ab',3]],5),RangeError);
assert.equal(solve([['ab',3]],6),'ababab');
};
