'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const blank=solve();assert.throws(()=>blank.build(),/Incomplete builder/);const done=blank.set("name","Ada");const a=done.build();assert.deepEqual(a,{"name":"Ada"});assert.notEqual(done.build(),a);assert.throws(()=>blank.build(),/Incomplete builder/);const other=solve().set("name","Ada");assert.deepEqual(other.build(),a);
};
