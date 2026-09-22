'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const blank=solve();assert.throws(()=>blank.build(),/Incomplete builder/);const done=blank.set("name","Ada").set("tags",["a","b"]);const a=done.build();assert.deepEqual(a,{"name":"Ada","tags":["a","b"]});assert.notEqual(done.build(),a);assert.throws(()=>blank.build(),/Incomplete builder/);const other=solve().set("name","Ada").set("tags",["a","b"]);assert.deepEqual(other.build(),a);
};
