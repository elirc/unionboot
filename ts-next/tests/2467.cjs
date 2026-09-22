'use strict';
const assert=require('node:assert/strict');
module.exports=async function(solve){
assert.equal(solve("s0",'advance'),"s1");assert.equal(solve("s1",'advance'),"s2");assert.equal(solve("s2",'advance'),"s3");assert.equal(solve("s3",'advance'),"s4");assert.throws(()=>solve("s4",'advance'),/Terminal state/);assert.throws(()=>solve('s0','reset'),/Invalid event/);
};
