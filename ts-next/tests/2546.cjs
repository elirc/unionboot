'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"tags":["a","b"]};assert.equal(fn.call(obj,'>'),">a,b");assert.equal(fn.call(obj,''),"a,b");const alt={...obj,tags:["a","b"]};assert.equal(fn.call(alt,'!'),"!a,b");assert.deepEqual(obj,{"tags":["a","b"]});
};
