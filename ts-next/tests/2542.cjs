'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const fn=solve();const obj={"active":true};assert.equal(fn.call(obj,'>'),">true");assert.equal(fn.call(obj,''),"true");const alt={...obj,active:true};assert.equal(fn.call(alt,'!'),"!true");assert.deepEqual(obj,{"active":true});
};
