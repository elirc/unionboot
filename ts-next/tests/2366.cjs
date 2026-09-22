'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const authority={capabilities:{"tags":true}};assert.deepEqual(solve(authority),{allowed:["tags"]});assert.deepEqual(solve({capabilities:{...authority.capabilities,extra:true}}),{allowed:["tags"]});assert.throws(()=>solve({capabilities:{}}),/Missing capability/);assert.deepEqual(authority.capabilities,{"tags":true});
};
