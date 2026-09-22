'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const authority={capabilities:{"name":true,"active":true,"tags":true}};assert.deepEqual(solve(authority),{allowed:["name","active","tags"]});assert.deepEqual(solve({capabilities:{...authority.capabilities,extra:true}}),{allowed:["name","active","tags"]});assert.throws(()=>solve({capabilities:{}}),/Missing capability/);assert.deepEqual(authority.capabilities,{"name":true,"active":true,"tags":true});
};
