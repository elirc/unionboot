'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"name":"Ada"};assert.equal(fn.call(obj,'>'),">Ada");assert.equal(fn.call(obj,''),"Ada");const alt={...obj,name:"Ada"};assert.equal(fn.call(alt,'!'),"!Ada");assert.deepEqual(obj,{"name":"Ada"});
};
