'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve({user:{name:'v12',age:12}},['user','age']),12);assert.equal(solve({user:null},['user','name']),undefined);assert.equal(solve({},['user','name']),undefined);assert.equal(solve({user:{name:''}},['user','name']),'');assert.equal(solve({user:{enabled:false}},['user','enabled']),false);const key=Symbol();assert.equal(solve({user:{[key]:3}},['user',key]),3);
};
