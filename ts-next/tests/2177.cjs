'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("/////////////////docs"),"///docs");assert.equal(solve('/a/b/'),'a/b/');assert.equal(solve(''),'');assert.equal(solve(' a/'),' a/');assert.equal(solve('a/../b'),'a/../b');
};
