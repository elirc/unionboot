'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const initial={"name":"Ada","count":3,"active":true};const a=solve(initial),b=solve(initial);assert.equal(a.get(),initial);const next={...initial};assert.equal(a.set(next),undefined);assert.equal(a.get(),next);assert.equal(b.get(),initial);assert.deepEqual(initial,{"name":"Ada","count":3,"active":true});
};
