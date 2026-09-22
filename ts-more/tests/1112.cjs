'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const nested={value:1};const input={count:13,nested};const out=solve(input);assert.notEqual(out,input);assert.deepEqual(out,input);assert.ok(Object.isFrozen(out));assert.ok(!Object.isFrozen(input));assert.equal(out.nested,nested);assert.ok(!Object.isFrozen(nested));assert.throws(()=>Object.defineProperty(out,'count',{value:113}),TypeError);const key=Symbol();assert.equal(solve({[key]:2})[key],2);
};
