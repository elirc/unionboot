'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const authority={capabilities:{"count":true,"active":true}};assert.deepEqual(solve(authority),{allowed:["count","active"]});assert.deepEqual(solve({capabilities:{...authority.capabilities,extra:true}}),{allowed:["count","active"]});assert.throws(()=>solve({capabilities:{}}),/Missing capability/);assert.deepEqual(authority.capabilities,{"count":true,"active":true});
};
