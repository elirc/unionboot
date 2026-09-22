'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"count":3,"active":true,"tags":["a","b"]};assert.equal(fn.call(obj,'>'),">3|true|a,b");assert.equal(fn.call(obj,''),"3|true|a,b");const alt={...obj,count:3};assert.equal(fn.call(alt,'!'),"!3|true|a,b");assert.deepEqual(obj,{"count":3,"active":true,"tags":["a","b"]});
};
