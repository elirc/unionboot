'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("s0",'advance'),"s1");assert.equal(solve("s1",'advance'),"s2");assert.throws(()=>solve("s2",'advance'),/Terminal state/);assert.throws(()=>solve('s0','reset'),/Invalid event/);
};
