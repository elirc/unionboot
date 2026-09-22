'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const input=Object.freeze({a:10,b:11});const seen=[];assert.deepEqual(solve(input,(value,key)=>{seen.push(key);return value*2;}),{a:20,b:22});assert.deepEqual(seen,['a','b']);assert.deepEqual(solve({},String),{});const key=Symbol();assert.deepEqual(solve({a:1,[key]:2},String),{a:'1'});const out=solve(JSON.parse('{"__proto__":3}'),x=>x+1);assert.equal(Object.getOwnPropertyDescriptor(out,'__proto__').value,4);
};
