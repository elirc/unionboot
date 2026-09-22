'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const seen=[];const c=solve({accept:value=>seen.push(value)});assert.equal(seen.length,0);const obj={"name":"Ada","count":3,"tags":["a","b"]};assert.equal(c.accept(obj),undefined);assert.equal(seen[0],obj);assert.equal(seen.length,1);assert.throws(()=>solve({accept:()=>{throw Error('accept');}}).accept(obj),/accept/);
};
