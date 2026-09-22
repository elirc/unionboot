'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const nested={x:1};const input=Object.freeze({count:8,name:'a',nested});const out=solve(input,'count',9);assert.deepEqual(out,{count:9,name:'a',nested});assert.notEqual(out,input);assert.equal(out.nested,nested);assert.equal(input.count,8);const key=Symbol();assert.equal(solve({[key]:1},key,2)[key],2);assert.deepEqual(solve({x:null},'x',null),{x:null});
};
