'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"name":"Ada","count":3,"active":true};assert.equal(fn.call(obj,'>'),">Ada|3|true");assert.equal(fn.call(obj,''),"Ada|3|true");const alt={...obj,name:"Ada"};assert.equal(fn.call(alt,'!'),"!Ada|3|true");assert.deepEqual(obj,{"name":"Ada","count":3,"active":true});
};
