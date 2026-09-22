'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const authority={capabilities:{"name":true}};assert.deepEqual(solve(authority),{allowed:["name"]});assert.deepEqual(solve({capabilities:{...authority.capabilities,extra:true}}),{allowed:["name"]});assert.throws(()=>solve({capabilities:{}}),/Missing capability/);assert.deepEqual(authority.capabilities,{"name":true});
};
