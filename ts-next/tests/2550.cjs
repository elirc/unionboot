'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"active":true,"tags":["a","b"]};assert.equal(fn.call(obj,'>'),">true|a,b");assert.equal(fn.call(obj,''),"true|a,b");const alt={...obj,active:true};assert.equal(fn.call(alt,'!'),"!true|a,b");assert.deepEqual(obj,{"active":true,"tags":["a","b"]});
};
