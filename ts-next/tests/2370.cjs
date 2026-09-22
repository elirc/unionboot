'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const authority={capabilities:{"active":true,"tags":true}};assert.deepEqual(solve(authority),{allowed:["active","tags"]});assert.deepEqual(solve({capabilities:{...authority.capabilities,extra:true}}),{allowed:["active","tags"]});assert.throws(()=>solve({capabilities:{}}),/Missing capability/);assert.deepEqual(authority.capabilities,{"active":true,"tags":true});
};
