'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"name":"Ada","active":true};assert.equal(fn.call(obj,'>'),">Ada|true");assert.equal(fn.call(obj,''),"Ada|true");const alt={...obj,name:"Ada"};assert.equal(fn.call(alt,'!'),"!Ada|true");assert.deepEqual(obj,{"name":"Ada","active":true});
};
