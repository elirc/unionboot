'use strict';
const assert = require('node:assert/strict');
module.exports = function check(solve) {
for(const [a,b,g] of [[30n,18n,6n],[17n,5n,1n],[0n,9n,9n],[0n,0n,0n]]){
const r=solve(a,b);assert.equal(r.gcd,g);assert.equal(a*r.x+b*r.y,g);}
assert.deepEqual(solve(0n,0n),{gcd:0n,x:1n,y:0n});
};
