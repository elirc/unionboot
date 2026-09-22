'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
let calls=0;const obj={"name":"Ada","active":true,"tags":["a","b"]};const p=solve({get:()=>{calls++;return obj;}});assert.equal(calls,0);assert.equal(p.get(),obj);assert.equal(p.get(),obj);assert.equal(calls,2);assert.throws(()=>solve({get:()=>{throw Error('get');}}).get(),/get/);
};
