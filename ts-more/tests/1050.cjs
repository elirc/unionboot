'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({id:11,name:'user',active:true}); assert.deepEqual(solve(input,['id','name']),{id:11,name:'user'}); assert.deepEqual(solve(input,[]),{}); assert.deepEqual(solve(input,['id','id']),{id:11}); const key=Symbol(); assert.equal(solve({[key]:4},[key])[key],4); const tricky=JSON.parse('{"__proto__":5}');assert.equal(Object.getOwnPropertyDescriptor(solve(tricky,['__proto__']),'__proto__').value,5);assert.throws(()=>solve(Object.create({id:1}),['id']),/Missing own key/);
};
