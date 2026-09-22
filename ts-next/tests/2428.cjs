'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input={"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"next":{"leaf":7}}}}}}}}}}};const out=solve(input);let a=input,b=out;for(let i=0;i<10;i++){assert.notEqual(a,b);assert.ok(Object.isFrozen(b));assert.ok(!Object.isFrozen(a));a=a.next;b=b.next;}assert.equal(a,b);assert.ok(!Object.isFrozen(b));assert.equal(solve(null),null);assert.equal(solve(3),3);
};
