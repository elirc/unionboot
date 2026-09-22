'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
const blank=solve();assert.throws(()=>blank.build(),/Incomplete builder/);const done=blank.set("count",3).set("active",true).set("tags",["a","b"]);const a=done.build();assert.deepEqual(a,{"count":3,"active":true,"tags":["a","b"]});assert.notEqual(done.build(),a);assert.throws(()=>blank.build(),/Incomplete builder/);const other=solve().set("count",3).set("active",true).set("tags",["a","b"]);assert.deepEqual(other.build(),a);
};
