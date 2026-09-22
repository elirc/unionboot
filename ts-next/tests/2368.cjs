'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const authority={capabilities:{"count":true,"tags":true}};assert.deepEqual(solve(authority),{allowed:["count","tags"]});assert.deepEqual(solve({capabilities:{...authority.capabilities,extra:true}}),{allowed:["count","tags"]});assert.throws(()=>solve({capabilities:{}}),/Missing capability/);assert.deepEqual(authority.capabilities,{"count":true,"tags":true});
};
