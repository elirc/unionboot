'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("s0",'advance'),"s1");assert.throws(()=>solve("s1",'advance'),/Terminal state/);assert.throws(()=>solve('s0','reset'),/Invalid event/);
};
