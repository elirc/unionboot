'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"name":"Ada","count":3,"active":true,"tags":["a","b"]};assert.equal(fn.call(obj,'>'),">Ada|3|true|a,b");assert.equal(fn.call(obj,''),"Ada|3|true|a,b");const alt={...obj,name:"Ada"};assert.equal(fn.call(alt,'!'),"!Ada|3|true|a,b");assert.deepEqual(obj,{"name":"Ada","count":3,"active":true,"tags":["a","b"]});
};
