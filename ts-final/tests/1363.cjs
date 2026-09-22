'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
let calls=0;const memo=solve(x=>{calls++;return x*2;});assert.equal(memo(9),18);assert.equal(memo(9),18);assert.equal(calls,1);let emptyCalls=0;const empty=solve(()=>{emptyCalls++;return undefined;});assert.equal(empty(1),undefined);assert.equal(empty(1),undefined);assert.equal(emptyCalls,1);const a={},b={};let objects=0;const obj=solve(()=>++objects);assert.equal(obj(a),1);assert.equal(obj(b),2);assert.equal(obj(a),1);let errors=0;const bad=solve(()=>{errors++;throw Error('retry');});assert.throws(()=>bad(1),/retry/);assert.throws(()=>bad(1),/retry/);assert.equal(errors,2);let nanCalls=0;const nan=solve(()=>++nanCalls);assert.equal(nan(NaN),1);assert.equal(nan(NaN),1);
};
