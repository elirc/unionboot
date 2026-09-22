'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const authority={capabilities:{"active":true}};assert.deepEqual(solve(authority),{allowed:["active"]});assert.deepEqual(solve({capabilities:{...authority.capabilities,extra:true}}),{allowed:["active"]});assert.throws(()=>solve({capabilities:{}}),/Missing capability/);assert.deepEqual(authority.capabilities,{"active":true});
};
