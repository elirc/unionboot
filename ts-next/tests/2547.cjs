'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"name":"Ada","tags":["a","b"]};assert.equal(fn.call(obj,'>'),">Ada|a,b");assert.equal(fn.call(obj,''),"Ada|a,b");const alt={...obj,name:"Ada"};assert.equal(fn.call(alt,'!'),"!Ada|a,b");assert.deepEqual(obj,{"name":"Ada","tags":["a","b"]});
};
