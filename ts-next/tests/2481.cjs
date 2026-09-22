'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const blank=solve();assert.throws(()=>blank.build(),/Incomplete builder/);const done=blank.set("name","Ada").set("count",3);const a=done.build();assert.deepEqual(a,{"name":"Ada","count":3});assert.notEqual(done.build(),a);assert.throws(()=>blank.build(),/Incomplete builder/);const other=solve().set("name","Ada").set("count",3);assert.deepEqual(other.build(),a);
};
